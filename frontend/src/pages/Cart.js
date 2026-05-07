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
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }
            await api.patch(`/cart/item/${itemId}/`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            if (error.response?.status === 401) {
                try {
                    const refresh = localStorage.getItem('refresh_token');
                    const response = await api.post('/auth/token/refresh/', { refresh });
                    localStorage.setItem('access_token', response.data.access);
                    await api.patch(`/cart/item/${itemId}/`, { quantity });
                    await fetchCart();
                } catch (refreshError) {
                    navigate('/login');
                }
            } else if (error.response?.status === 404) {
                alert('Товар не найден в корзине');
                await fetchCart();
            } else {
                alert('Ошибка при обновлении количества');
            }
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (itemId) => {
        if (!window.confirm('Удалить товар из корзины?')) return;
        setUpdating(true);
        try {
            await api.delete(`/cart/item/${itemId}/`);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
            if (error.response?.status === 404) {
                alert('Товар уже удалён');
                await fetchCart();
            } else {
                alert('Ошибка при удалении');
            }
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
            <div style={styles.emptyCart}>
                <h2>🛒 Корзина пуста</h2>
                <p style={styles.emptyText}>Но у нас есть много вкусняшек!</p>
                <Link to="/" style={styles.shopLink}>
                    <button style={styles.shopBtn}>🍰 Перейти к покупкам</button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2>🛒 Моя корзина</h2>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <div style={{flex: 2}}>
                    {cart.items.map((item) => (
                        <div key={item.id} className="card" style={{display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
                            {item.product.photo && (
                                <img
                                    src={`http://localhost:8000${item.product.photo}`}
                                    alt={item.product.title}
                                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px'}}
                                />
                            )}
                            <div style={{flex: 1, minWidth: '120px'}}>
                                <h3 style={{margin: 0}}>{item.product.title}</h3>
                                <p style={{margin: '5px 0', color: '#ff6699'}}>{item.product.price} руб.</p>
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
                                style={{background: '#ff6666', padding: '8px 15px', border: 'none', borderRadius: '25px', cursor: 'pointer', color: 'white'}}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{flex: 1}}>
                    <div className="card" style={{position: 'sticky', top: '20px', padding: '20px', borderRadius: '15px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                        <h3>Итого: <strong>{cart.total_price} руб.</strong></h3>
                        <button onClick={checkout} style={{width: '100%', marginTop: '15px', background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)', color: 'white', border: 'none', padding: '12px', borderRadius: '30px', cursor: 'pointer'}}>
                            Оформить заказ 🍰
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    emptyCart: {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    emptyText: {
        marginBottom: '30px',
        color: '#888',
        fontSize: '16px',
    },
    shopLink: {
        textDecoration: 'none',
    },
    shopBtn: {
        background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        borderRadius: '30px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default Cart;