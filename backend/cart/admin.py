from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('product', 'quantity')
    can_delete = False


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'item_count', 'total_price', 'created_at')
    list_display_links = ('id', 'user')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [CartItemInline]
    search_fields = ('user__username', 'user__email')

    def item_count(self, obj):
        return obj.items.count()

    item_count.short_description = 'Кол-во позиций'

    def total_price(self, obj):
        total = sum(item.product.price * item.quantity for item in obj.items.all())
        return f'{total} ₽'

    total_price.short_description = 'Итого'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'subtotal')
    list_display_links = ('id',)
    search_fields = ('cart__user__username', 'product__title')

    def subtotal(self, obj):
        return f'{obj.product.price * obj.quantity} ₽'

    subtotal.short_description = 'Сумма'