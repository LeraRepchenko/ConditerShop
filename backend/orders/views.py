from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem
from cart.models import Cart
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Оптимизация: prefetch_related('items', 'items__product') — загружаем позиции и товары одним запросом
        return Order.objects.filter(user=self.request.user).order_by('-created_at').prefetch_related(
            'items',
            'items__product'
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(user=self.request.user).prefetch_related(
            'items',
            'items__product'
        )


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        cart = get_object_or_404(Cart.objects.prefetch_related('items__product'), user=request.user)

        if not cart.items.exists():
            return Response({'error': 'Корзина пуста'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart.items.all())

        order = Order.objects.create(
            user=request.user,
            delivery_address=serializer.validated_data['delivery_address'],
            phone=serializer.validated_data['phone'],
            total_price=total_price
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.title,
                price=cart_item.product.price,
                quantity=cart_item.quantity
            )

        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderUpdateStatusView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Order.objects.all()