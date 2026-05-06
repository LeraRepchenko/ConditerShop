import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart/');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        setUpdating(true);
        try {
            await api.patch(`/cart/update/${itemId}/`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Ошибка при обновлении количества');
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Удалить товар из корзины?')) return;
        setUpdating(true);
        try {
            await api.delete(`/cart/remove/${itemId}/`);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Ошибка при удалении');
        } finally {
            setUpdating(false);
        }
    };

    const checkout = () => {
        navigate('/checkout');
    };

    if (loading) return <div style={{textAlign: 'center', padding: 50}}>🍰 Загрузка корзины...</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: 50}}>
                <h2>🛒 Корзина пуста</h2>
                <p>Но у нас есть много вкусняшек!</p>
                <Link to="/" className="btn">🍰 Перейти к покупкам</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>🛒 Моя корзина</h2>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div style={{flex: 2}}>
                    {cart.items.map((item) => (
                        <div key={item.id} className="card" style={{display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center'}}>
                            {item.product.photo && (
                                <img
                                    src={`http://localhost:8000${item.product.photo}`}
                                    alt={item.product.title}
                                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px'}}
                                />
                            )}
                            <div style={{flex: 1}}>
                                <h3>{item.product.title}</h3>
                                <p>{item.product.price} руб.</p>
                            </div>
                            <div>
                                <label>Количество: </label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    style={{width: '70px', marginRight: '10px'}}
                                    disabled={updating}
                                />
                            </div>
                            <div style={{minWidth: '100px', textAlign: 'right'}}>
                                <strong>{item.subtotal} руб.</strong>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                disabled={updating}
                                style={{background: '#ff6666', padding: '8px 15px'}}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{flex: 1}}>
                    <div className="card" style={{position: 'sticky', top: '20px'}}>
                        <h3>Итого: <strong>{cart.total_price} руб.</strong></h3>
                        <button onClick={checkout} style={{width: '100%', marginTop: '15px'}}>
                            Оформить заказ 🍰
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;