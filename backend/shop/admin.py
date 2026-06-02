from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'product_count')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    prepopulated_fields = {'slug': ('title',)}

    def product_count(self, obj):
        return obj.product_set.count()

    product_count.short_description = '📦 Кол-во товаров'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Какие поля показывать в списке товаров (убрали views)
    list_display = (
        'id',
        'title',
        'price',
        'category',
        'is_available',
        'created_at',
        # 'views' ← удалили эту строку
    )


    list_display_links = ('id', 'title')


    list_editable = ('price', 'is_available')


    search_fields = ('title', 'description')


    list_filter = ('category', 'is_available', 'created_at')


    readonly_fields = ('created_at',)


    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'slug', 'description', 'category')
        }),
        ('Цена и наличие', {
            'fields': ('price', 'is_available'),
            'classes': ('wide',)
        }),
        ('Изображение', {
            'fields': ('photo',),
            'classes': ('collapse',)
        }),
        ('Статистика', {
            'fields': ('created_at',),  # ← убрали 'views'
            'classes': ('collapse',)
        }),
    )


    prepopulated_fields = {'slug': ('title',)}


    actions = ['make_available', 'make_unavailable']

    def make_available(self, request, queryset):
        queryset.update(is_available=True)

    make_available.short_description = '✅ Отметить как "В наличии"'

    def make_unavailable(self, request, queryset):
        queryset.update(is_available=False)

    make_unavailable.short_description = '❌ Отметить как "Нет в наличии"'