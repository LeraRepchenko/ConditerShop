import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/');
            // Проверяем, массив ли пришёл, или объект с пагинацией
            if (Array.isArray(response.data)) {
                setOrders(response.data);
            } else if (response.data.results && Array.isArray(response.data.results)) {
                setOrders(response.data.results);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Новый': return '#ff99bb';
            case 'В обработке': return '#ffcc66';
            case 'Доставляется': return '#66cc99';
            case 'Выполнен': return '#66cc66';
            case 'Отменён': return '#ff6666';
            default: return '#888';
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: 50}}>🍰 Загрузка заказов...</div>;

    if (!orders || orders.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: 50}}>
                <h2>📦 У вас пока нет заказов</h2>
                <p>Но это легко исправить!</p>
                <a href="/" className="btn">🍰 Перейти к покупкам</a>
            </div>
        );
    }

    return (
        <div>
            <h2>📦 История заказов</h2>
            {orders.map((order) => (
                <div key={order.id} className="card" style={{marginBottom: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <h3>Заказ №{order.id}</h3>
                        <span style={{
                            background: getStatusColor(order.status),
                            padding: '5px 15px',
                            borderRadius: '20px',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {order.status}
                        </span>
                    </div>
                    <p><strong>📅 Дата:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>📍 Адрес:</strong> {order.delivery_address}</p>
                    <p><strong>📞 Телефон:</strong> {order.phone}</p>
                    <div style={{marginTop: '10px'}}>
                        <strong>🍰 Состав заказа:</strong>
                        {order.items && order.items.map((item) => (
                            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #ffccdd'}}>
                                <span>{item.product_name} x {item.quantity}</span>
                                <span>{item.price * item.quantity} ₽</span>
                            </div>
                        ))}
                    </div>
                    <div style={{textAlign: 'right', marginTop: '15px', fontSize: '18px', fontWeight: 'bold'}}>
                        Итого: <span style={{color: '#ff6699'}}>{order.total_price} ₽</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistory;