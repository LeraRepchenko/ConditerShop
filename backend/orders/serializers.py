from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'delivery_address', 'phone', 'status', 'total_price', 'created_at', 'items']
        read_only_fields = ['status', 'total_price', 'created_at']

class OrderCreateSerializer(serializers.Serializer):
    delivery_address = serializers.CharField()
    phone = serializers.CharField()