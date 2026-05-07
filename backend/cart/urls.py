from django.urls import path
from .views import CartView, AddToCartView, RemoveFromCartView, UpdateCartItemView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('item/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('item/<int:pk>/', RemoveFromCartView.as_view(), name='remove-cart-item'),
]