from django.db import models
from django.conf import settings
from shop.models import Product


class Order(models.Model):

    STATUS_CHOICES = (
        ('Новый', 'Новый'),
        ('В обработке', 'В обработке'),
        ('Доставляется', 'Доставляется'),
        ('Выполнен', 'Выполнен'),
        ('Отменён', 'Отменён'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Пользователь'
    )
    delivery_address = models.TextField('Адрес доставки')
    phone = models.CharField('Телефон', max_length=20)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='Новый')
    total_price = models.DecimalField('Итоговая сумма', max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заказ #{self.id} - {self.user.username}'


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Товар'
    )
    product_name = models.CharField('Название товара', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField('Количество', default=1)

    def __str__(self):
        return f'{self.product_name} x {self.quantity}'