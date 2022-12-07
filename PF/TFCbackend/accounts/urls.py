from rest_framework import routers
from django.urls import path
from accounts import views as accounts_views
from accounts.views import PaymentsView, AddPaymentInfoView, EditPaymentInfoView, EditSubscriptionView, DeleteSubscriptionView, SubscriptionTypesView

api_routes = routers.DefaultRouter()
api_routes.register('accounts', accounts_views.AccountsAPIViewSet, basename='accounts')

app_name = 'accounts'

urlpatterns = [
    path('payment/history/', PaymentsView.as_view()),
    path('payment-info/add/', AddPaymentInfoView.as_view()),
    path('payment-info/edit/', EditPaymentInfoView.as_view()),
    # path('subscription/add/', AddSubscriptionView.as_view()),
    path('subscription/edit/', EditSubscriptionView.as_view()),
    path('subscription/delete/', DeleteSubscriptionView.as_view()),
    path('subscription/types/', SubscriptionTypesView.as_view())
]