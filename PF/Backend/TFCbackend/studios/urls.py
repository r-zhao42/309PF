from django.urls import path

from .views import StudioView, StudiosView, SearchClassesView, perform_create, perform_delete, get_directions, ClassScheduleView

app_name = 'studios'

urlpatterns = [
    path('<str:studio_name>/details/', StudioView.as_view()),
    path('<str:studio_name>/directions/', get_directions),
    path('list/', StudiosView.as_view()),
    path('<str:studio_name>/classes/list/', SearchClassesView.as_view()),
    path('classes/enroll/', perform_create),
    path('classes/unenroll/', perform_delete),
    path('schedule/', ClassScheduleView.as_view()),
]