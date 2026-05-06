from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='orders'),
    path('create/', views.OrderCreateView.as_view(), name='create-order'),
]