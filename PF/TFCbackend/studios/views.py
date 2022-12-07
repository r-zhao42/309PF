from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
import geopy.distance
import datetime
from django.utils.timezone import make_aware
from rest_framework import status

from .models import Studio, Class, RepeatClass, Enrollment
from accounts.models import Subscription
from .serializers import StudioSerializer, RepeatClassSerializer, EnrollmentSerializer
from django.shortcuts import redirect
from studios.pagination import StudioPagination, ClassPagination
from django.utils import timezone



class StudioView(RetrieveAPIView):
    permission_classes = []
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, name__iexact=self.kwargs['studio_name'])

class StudiosView(ListAPIView):
    permission_classes = []
    serializer_class = StudioSerializer
    pagination_class = StudioPagination

    def get_queryset(self):
        amenities = self.request.GET.get("amenities", None)
        classes = self.request.GET.get("classes", None)
        coaches = self.request.GET.get("coaches", None)
        name = self.request.GET.get("name", None)
        studios = Studio.objects.all()

        # We want studios that have ALL amenities in filter
        if amenities:
            for a in amenities.split(','):
                studios = studios.filter(amenities__name__icontains=a)

        # Studios with all classes
        if classes:
            for c in classes.split(','):
                studios = studios.filter(classes__name__icontains=c)

        # Studios with all coaches
        if coaches:
            for c in coaches.split(','):
                studios = studios.filter(classes__coach__icontains=c)

        # studios with at least one of the search names
        if name:
            studios = studios.filter(name__icontains=name)
 
        studios = list(studios.distinct())

        # Check if we can cast query parameters into float, default to (0.0, 0,0) if not
        try:
            lat = float(self.request.GET.get('lat', '0.0'))
            lon = float(self.request.GET.get('lon', '0.0'))
        except:
            lat = 0.0
            lon = 0.0

        pin = (lat, lon)

        # Sort based on geopy.distance func
        result = sorted(studios, key=lambda studio: geopy.distance.distance(studio.location, pin).km)

        return result


class ClassView(ListAPIView):
    serializer_class = RepeatClassSerializer

    def get_queryset(self):
        obj = get_object_or_404(Studio, name__iexact=self.kwargs['studio_name'])
        return RepeatClass.objects.filter(studio=obj, start_time__gte=timezone.now(), cancelled=False).order_by('start_time')

class SearchClassesView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = RepeatClassSerializer
    pagination_class = ClassPagination

    def get_queryset(self):
        classes = RepeatClass.objects.filter(parent_class__studio__name__iexact=self.kwargs['studio_name'], start_time__gte=timezone.now(), cancelled=False)

        name = self.request.GET.get('name', None)
        date = self.request.GET.get('date', None)
        coach = self.request.GET.get('coach', None)
        startTime = self.request.GET.get('start_time', None)
        endTime = self.request.GET.get('end_time', None)
        #classes with at least one of the search names
        if name:
            classes = classes.filter(parent_class__name__icontains=name)
        
        # classes with at least one of the search coaches
        if coach:
            classes = classes.filter(parent_class__coach__icontains=coach)

        #classes on any of the search dates
        if date:
            date = date.split('-')
            classes = classes.filter(start_time__year=date[0],
                                    start_time__month=date[1],
                                    start_time__day=date[2])
        if startTime:
            classes = classes.filter(start_time__time__gte=startTime)
        if endTime:
            classes = classes.filter(end_time__time__lte=endTime)

        return classes.order_by('start_time')

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def perform_create(request):
    """
    Endpoint for enrolling in classes. Can choose to enroll in all future RepeatClass instances
    Sharing the same parent_class type.

    Parameters:
        - class_id: int
        - enroll_future: Bool
            Whether or not to enroll in all future classes. Defaults false.
        

    Validation Error if:
        - User doesn't have subscription
        - Date of class is already past
        - User is already enrolled in the class
        - Class has reached max capacity
        - Class has been cancelled
    """
    # check for invalid data
    if request.POST.get('class_id', None) is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if not RepeatClass.objects.filter(id=request.POST.get("class_id")).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    # check if the user has a subscription
    if not Subscription.objects.filter(account=request.user).exists():
        return Response('User does not have an active subscription')

    # check if class has already passed
    target_class = RepeatClass.objects.get(id=request.POST.get('class_id'))

    if target_class.start_time < timezone.now():
        return Response('Enrollment Unsuccessful: This datetime of this class has already passed')

    # user wants to enrol in all future instances of this class
    if request.POST.get('enroll_future', False):
        # get parent class and date of target class
        parent_class = target_class.parent_class
        date_of_class = target_class.start_time    

        # get all repeatclass instances with same parent class as the target class and filter for only ones that occur at the same or later date
        queryset = RepeatClass.objects.filter(parent_class=parent_class, start_time__gte=date_of_class)

    # user wants to enrol in one instance of this class
    else:
        queryset = RepeatClass.objects.filter(id=request.POST.get('class_id', None))
    
    for item in queryset:
        # check number of enrollments in this class 
        num_enrols = len(Enrollment.objects.filter(repeat_class=item))

        # enrol the user in the class if number of enrollments is less than capacity
        if num_enrols >= item.parent_class.capacity:
            return Response('Enrollment Unsuccessful: This class has reached capacity')

        # disallow duplicate enrollments
        elif Enrollment.objects.filter(repeat_class=item, user=request.user).exists():
            return Response('Enrollment Unsuccessful: User is already enrolled in this class')

        else:
            enrol = Enrollment.objects.create(repeat_class=item, user = request.user)
            enrol.save()

    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def perform_delete(request):
    """
    Endpoint for unenrolling in classes. Can choose to unenroll in all future RepeatClass instances
    sharing the same parent_class type.
    
    Parameters:
        - class_id: int
        - enroll_future: Bool
            Whether or not to unenroll in all future classes. Defaults to false.
    
    Validation Error if:
        - User is not not enrolled in class
        - Datetime for class has past
    """
    # check for invalid data
    if request.POST.get('class_id', None) is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if not RepeatClass.objects.filter(id=request.POST.get('class_id')).exists():
        return Response(status=status.HTTP_404_NOT_FOUND)

    # check if user is enrolled in class
    if not Enrollment.objects.filter(repeat_class=request.POST.get('class_id'), user=request.user).exists():
        return Response('Unenrollment Unsuccessful: User is not enrolled in this class')

    # check if class has already passed
    target_class = RepeatClass.objects.get(id=request.POST.get('class_id'))

    if target_class.start_time < timezone.now():
        return Response('Unenrollment Unsuccessful: This datetime of this class has already passed')

    # user wants to unenroll from all future classes
    if request.POST.get('enroll_future', False):
        # get ids of all classes with same parent class
        parent_class = RepeatClass.objects.get(id=request.POST.get("class_id", None)).parent_class
        queryset = RepeatClass.objects.filter(parent_class=parent_class)

    # user only wants to unenroll from this class
    else:
        queryset = Enrollment.objects.filter(repeat_class=request.POST.get('class_id'), user=request.user)

    queryset.delete()

    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_directions(request,studio_name):
    """
    We simply redirect the user to a google maps page with the destination set to the gym.
    Currently, we don't automatically input the point of origin for the user, they 
    must set it themselves.
    https://www.google.com/maps/dir/?api=1&destination=43.661430,-79.397000
     """
    studio = get_object_or_404(Studio, name__iexact=studio_name)
    location = studio.location
    request = f"https://www.google.com/maps/dir/?api=1&destination={location}"
    return Response(request)

class ClassScheduleView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        request = self.request.GET
        history = request.get("history", False)
        if history:
            return Enrollment.objects.filter(user__email=self.request.user.email).order_by('repeat_class__start_time')
        return Enrollment.objects.filter(user__email=self.request.user.email, repeat_class__start_time__gte=timezone.now()).order_by('repeat_class__start_time')
