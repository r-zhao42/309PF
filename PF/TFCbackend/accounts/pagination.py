from rest_framework.pagination import PageNumberPagination

class PaymentHistoryPagination(PageNumberPagination):
    page_size = 10