from django.urls import path,include
from .views import UserList,UserDeactivate,TotalSales,SalesDetailsListView,AdminLoginView,SubscriptionListView,BadgesViewset
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'badges', BadgesViewset, basename='badges')
urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='login'),
    path('users/', UserList.as_view(), name='custom_admin'),
    path('users/deactivate/<str:username>/', UserDeactivate.as_view(), name='user-deactivate'),
    path('total-sales/', TotalSales.as_view(), name='total-sales'),
    path('sales-details/',SalesDetailsListView.as_view(),name='sales-details'),
    path('subscription-details/',SubscriptionListView.as_view(),name='subscription-details'),
    path('', include(router.urls)),

   
]
