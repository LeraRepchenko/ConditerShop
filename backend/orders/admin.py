from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'status',
        'total_price',
        'created_at'
    )
    list_display_links = ('id', 'user')
    list_editable = ('status',)  # можно менять статус прямо в списке
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'delivery_address', 'phone')
    readonly_fields = ('total_price', 'created_at')
    inlines = [OrderItemInline]

    fieldsets = (
        ('Информация о заказе', {
            'fields': ('user', 'status', 'total_price', 'created_at')
        }),
        ('Данные доставки', {
            'fields': ('delivery_address', 'phone'),
            'classes': ('wide',)
        }),
    )

    actions = ['mark_as_processing', 'mark_as_delivering', 'mark_as_completed']

    def mark_as_processing(self, request, queryset):
        queryset.update(status='В обработке')

    mark_as_processing.short_description = '🚚 Отметить как "В обработке"'

    def mark_as_delivering(self, request, queryset):
        queryset.update(status='Доставляется')

    mark_as_delivering.short_description = '🚛 Отметить как "Доставляется"'

    def mark_as_completed(self, request, queryset):
        queryset.update(status='Выполнен')

    mark_as_completed.short_description = '✅ Отметить как "Выполнен"'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product_name', 'price', 'quantity')
    list_display_links = ('id',)
    search_fields = ('order__user__username', 'product_name')