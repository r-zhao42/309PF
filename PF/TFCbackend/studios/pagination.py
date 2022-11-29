from rest_framework.pagination import PageNumberPagination

class StudioPagination(PageNumberPagination):
    page_size = 5

class ClassPagination(PageNumberPagination):
    page_size = 10