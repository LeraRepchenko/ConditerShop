import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const Checkout = () => {
    const [formData, setFormData] = useState({
        delivery_address: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { cart, fetchCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (cart && cart.items && cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/orders/create/', formData);
            await fetchCart(); // очищаем корзину
            navigate('/orders');
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Ошибка при оформлении заказа. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return <div style={{textAlign: 'center', padding: 50}}>🍰 Загрузка...</div>;

    return (
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <h2>🍰 Оформление заказа</h2>

            <div className="card" style={{marginBottom: '20px'}}>
                <h3>Ваш заказ:</h3>
                {cart.items?.map((item) => (
                    <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ffccdd'}}>
                        <span>{item.product.title} x {item.quantity}</span>
                        <span>{item.subtotal} ₽</span>
                    </div>
                ))}
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '18px'}}>
                    <span>Итого:</span>
                    <span style={{color: '#ff6699'}}>{cart.total_price} ₽</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <h3>Данные для доставки</h3>

                {error && <div style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

                <div style={{marginBottom: '15px'}}>
                    <label>📞 Телефон *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+7 (XXX) XXX-XX-XX"
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>📍 Адрес доставки *</label>
                    <textarea
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Город, улица, дом, квартира"
                    />
                </div>

                <button type="submit" disabled={loading} style={{width: '100%'}}>
                    {loading ? 'Оформление...' : '✅ Подтвердить заказ'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;