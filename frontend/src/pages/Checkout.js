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
            await fetchCart();
            navigate('/orders');
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Ошибка при оформлении заказа. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return <div style={styles.center}>🍰 Загрузка...</div>;

    return (
        <div style={styles.container}>
            <h2>🍰 Оформление заказа</h2>

            <div style={styles.orderSummary}>
                <h3 style={styles.summaryTitle}>📋 Ваш заказ:</h3>
                <div style={styles.itemsList}>
                    {cart.items?.map((item) => (
                        <div key={item.id} style={styles.orderItem}>
                            <span style={styles.itemName}>{item.product.title} x {item.quantity}</span>
                            <span style={styles.itemPrice}>{item.subtotal} ₽</span>
                        </div>
                    ))}
                </div>
                <div style={styles.totalRow}>
                    <span>Итого:</span>
                    <span style={styles.totalPrice}>{cart.total_price} ₽</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <h3 style={styles.formTitle}>🚚 Данные для доставки</h3>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.formGroup}>
                    <label style={styles.label}>📞 Телефон *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+7 (XXX) XXX-XX-XX"
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>📍 Адрес доставки *</label>
                    <textarea
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Город, улица, дом, квартира"
                        style={styles.textarea}
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                    {loading ? 'Оформление...' : '✅ Подтвердить заказ'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
    },
    center: {
        textAlign: 'center',
        padding: '50px',
    },
    orderSummary: {
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    summaryTitle: {
        marginTop: 0,
        marginBottom: '15px',
        borderBottom: '2px solid #ffccdd',
        paddingBottom: '10px',
    },
    itemsList: {
        marginBottom: '15px',
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #ffe6f0',
        flexWrap: 'wrap',
        gap: '10px',
    },
    itemName: {
        flex: 1,
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#ff6699',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
        paddingTop: '10px',
        borderTop: '2px solid #ffccdd',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    totalPrice: {
        color: '#ff6699',
        fontSize: '20px',
    },
    form: {
        background: 'white',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    formTitle: {
        marginTop: 0,
        marginBottom: '20px',
        borderBottom: '2px solid #ffccdd',
        paddingBottom: '10px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '2px solid #ffccdd',
        borderRadius: '10px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '2px solid #ffccdd',
        borderRadius: '10px',
        fontSize: '16px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        resize: 'vertical',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        fontSize: '18px',
        cursor: 'pointer',
    },
    error: {
        background: '#ffe6e6',
        color: '#ff3333',
        padding: '10px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
};

export default Checkout;