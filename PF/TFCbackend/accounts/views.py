import rest_framework
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.serializers import Serializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView
import datetime
from dateutil.relativedelta import relativedelta
from django.utils import timezone

from .permissions import IsSelfOrAdmin
from .serializers import AuthTokenSerializer, RegisterAccountSerializer, EditAccountSerializer, DetailAccountSerializer, SubscriptionSerializer, PaymentInfoSerializer, PaymentSerializer
from .models import Account, Subscription, PaymentInfo, Payment, SubscriptionType
from studios.models import Enrollment

class AccountsAPIViewSet(GenericViewSet, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin):
    
    lookup_field = 'email'
    lookup_url_kwarg = 'email'
    authentication_classes = [
        TokenAuthentication,
    ]

    queryset = get_user_model().objects.all()

    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterAccountSerializer
        elif self.action == 'edit':
            return EditAccountSerializer
        elif self.action == 'details':
            return DetailAccountSerializer
        elif self.action == 'login':
            return AuthTokenSerializer
        elif self.action == 'logout':
            return Serializer
        return DetailAccountSerializer

    def get_permissions(self):
        if self.action in ['register', 'login']:
            permission_list = [AllowAny]
        elif self.action in ['edit']:
            permission_list = [IsSelfOrAdmin, IsAuthenticated]
        elif self.action in ['details', 'logout']:
            permission_list = [IsAuthenticated]
        else:
            permission_list = [AllowAny]
        return [permission() for permission in permission_list]
    
    @rest_framework.decorators.action(methods=["POST"], detail=False)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        validated_data = serializer.validate(request.data)
        account = serializer.save(validated_data)
        token = Token.objects.get_or_create(user=account)[0]
        account = serializer.serialize(account)
        return rest_framework.response.Response({'token': token.key, 'new_account': account})

    @rest_framework.decorators.action(methods=["POST"], detail=False)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = serializer.validated_data['user']
        token = Token.objects.get_or_create(user=account)[0]
        return rest_framework.response.Response({'token': token.key})
    
    @rest_framework.decorators.action(methods=["PUT"], detail=False)
    def edit(self, request):
        serializer = self.get_serializer(data=request.data)
        validated_data = serializer.validate(request.data)
        print(validated_data)
        account = get_object_or_404(Account, email=request.user.email)
        account = serializer.save(validated_data, account)
        account = serializer.serialize(account)
        return rest_framework.response.Response({'updated_account': account})
    
    @rest_framework.decorators.action(methods=["GET"], detail=False)
    def details(self, request):
        serializer = self.get_serializer(data=request.data)
        account = get_object_or_404(Account, email=request.user.email)
        account = serializer.serialize(account)
        return rest_framework.response.Response({'account_details': account})

    @rest_framework.decorators.action(methods=["POST"], detail=False)
    def logout(self, request):
        get_object_or_404(Token, user=request.user).delete()
        return rest_framework.response.Response("Successfully Logged Out", status=rest_framework.status.HTTP_202_ACCEPTED)

class AddPaymentInfoView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentInfoSerializer

    def post(self, request):

        account = get_object_or_404(Account, email=request.user.email)

        paymentInfo = PaymentInfo.objects.filter(account=account)

        if len(paymentInfo) == 0:
            payment_info = PaymentInfo.objects.create(**self.request.POST.dict())
            payment_info.account = account
            payment_info.save()
            return rest_framework.response.Response('Payment Info Successfully Added', status=rest_framework.status.HTTP_200_OK)
        
        return rest_framework.response.Response('Request Unsuccessful: Account has payment info added already', status=rest_framework.status.HTTP_401_UNAUTHORIZED)

class EditPaymentInfoView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentInfoSerializer

    def put(self, request, *args, **kwargs):
        return rest_framework.response.Response({"detail":"Method \"PUT\" not allowed."}, status=rest_framework.status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        account = get_object_or_404(Account, email=request.user.email)
        paymentInfo = PaymentInfo.objects.filter(account=account)
        if len(paymentInfo) == 1:
            payment_info = paymentInfo.first()
            serializer = self.get_serializer()
            #validate data
            serializer.save(self.request.POST.dict(), payment_info)
            return rest_framework.response.Response('Payment Info Successfully Edited', status=rest_framework.status.HTTP_200_OK)

        return rest_framework.response.Response('Request Unsuccessful: Account does not have payment info', status=rest_framework.status.HTTP_200_OK)


class AddSubscriptionView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request):
        account = get_object_or_404(Account, email=request.user.email)

        # invalid info
        if request.POST.get('sub_type', None) is None:
            return rest_framework.response.Response(status=rest_framework.status.HTTP_400_BAD_REQUEST)
        
        if not SubscriptionType.objects.filter(type=request.POST.get('sub_type')).exists():
            return rest_framework.response.Response('Request Not Completed: Subscription type does not exists', status=rest_framework.status.HTTP_404_NOT_FOUND)

        paymentInfo = PaymentInfo.objects.filter(account=account)
        # Check if payment info exists, only add subscription if there is payment info in database
        if len(paymentInfo) == 0:
            return rest_framework.response.Response('Request Not Completed: User does not have payment info', status=rest_framework.status.HTTP_200_OK) 

        subscription = Subscription.objects.filter(account=request.user)
        # Only allow creating subscription if user doesn't already have subscription
        if len(subscription) > 0:
            return rest_framework.response.Response('Request Not Completed: User already has a subscription', status=rest_framework.status.HTTP_200_OK)

        # decide next payment date
        if request.POST.get('sub_type') == 'monthly':
            subtype = SubscriptionType.objects.get(type='monthly')
            next_payment_date = datetime.date.today() + relativedelta(months=+1)
        else:
            subtype = SubscriptionType.objects.get(type='yearly')
            next_payment_date = datetime.date.today() + relativedelta(years=+1)

        new_subscription = Subscription.objects.create(account=account, sub_type=subtype, start_date=timezone.now(), next_payment_date=next_payment_date)
        new_subscription.save()
        new_payment = Payment.objects.create(account=request.user, amount=new_subscription.sub_type.amount, datetime=timezone.now(), payment_info=paymentInfo.first())
        new_payment.save()
        return rest_framework.response.Response('Subscription Added', status=rest_framework.status.HTTP_200_OK)

class EditSubscriptionView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def put(self, request, *args, **kwargs):
        return rest_framework.response.Response({"detail":"Method \"PUT\" not allowed."}, status=rest_framework.status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        account = get_object_or_404(Account, email=request.user.email)

        if request.data.get('sub_type', None) is None:
            return rest_framework.response.Response(status=rest_framework.status.HTTP_400_BAD_REQUEST)
        
        if not SubscriptionType.objects.filter(type=request.POST.get('sub_type')).exists():
            return rest_framework.response.Response('Request Not Completed: Subscription type does not exists', status=rest_framework.status.HTTP_404_NOT_FOUND)

        subscription = Subscription.objects.filter(account=account)
        
        if len(subscription) == 0:
            return rest_framework.response.Response('Request Not Completed: User does not have a subscription', status=rest_framework.status.HTTP_200_OK)

        subscription = Subscription.objects.get(account=account)

        serializer = self.get_serializer()
        serializer.save({'sub_type': SubscriptionType.objects.get(type=request.data.get('sub_type', None))}, subscription)

        return rest_framework.response.Response('Subscription successfully updated', status=rest_framework.status.HTTP_200_OK)

class DeleteSubscriptionView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer

    def post(self, request):
        account = get_object_or_404(Account, email=request.user.email)

        if not Subscription.objects.filter(account=account).exists():
            return rest_framework.response.Response('User does not have an active subscription to delete', status=rest_framework.status.HTTP_200_OK)

        Subscription.objects.filter(account=account).delete()

        # remove enrollments that this user has
        Enrollment.objects.filter(user=account).delete()

        return rest_framework.response.Response('Subscription successfully deleted', status=rest_framework.status.HTTP_200_OK)

class PaymentsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        account = get_object_or_404(Account, email=self.request.user.email)
        payments = Payment.objects.filter(account=account)
        return payments
