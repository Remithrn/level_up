from django.urls import path
from .views import CreateOrderAPIView, TransactionAPIView
urlpatterns = [
    path('create-order/', CreateOrderAPIView.as_view(), name='create-order'),
    path('order-complete/', TransactionAPIView.as_view(), name='transaction'),
]