import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';


const getImageUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    if (photo.startsWith('/media/')) return `http://localhost:8000${photo}`;
    if (photo.startsWith('media/')) return `http://localhost:8000/${photo}`;
    return `http://localhost:8000/media/${photo}`;
};

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
                        <div key={item.id} style={styles.cartItem}>
                            {item.product.photo && (
                                <img
                                    src={getImageUrl(item.product.photo)}
                                    alt={item.product.title}
                                    style={styles.productImage}
                                />
                            )}
                            {!item.product.photo && (
                                <div style={styles.productImagePlaceholder}>🍰</div>
                            )}
                            <div style={styles.productInfo}>
                                <h3 style={styles.productTitle}>{item.product.title}</h3>
                                <p style={styles.productPrice}>{item.product.price} ₽</p>
                            </div>
                            <div style={styles.quantityControl}>
                                <label>Кол-во:</label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    style={styles.quantityInput}
                                    disabled={updating}
                                />
                            </div>
                            <div style={styles.subtotal}>
                                <strong>{item.subtotal} ₽</strong>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                disabled={updating}
                                style={styles.removeBtn}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{flex: 1}}>
                    <div style={styles.totalCard}>
                        <h3>Итого: <strong>{cart.total_price} ₽</strong></h3>
                        <button onClick={checkout} style={styles.checkoutBtn}>
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
    cartItem: {
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '15px',
        borderRadius: '15px',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    productImage: {
        width: '80px',
        height: '80px',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    productImagePlaceholder: {
        width: '80px',
        height: '80px',
        background: '#ffccdd',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
    },
    productInfo: {
        flex: 1,
        minWidth: '120px',
    },
    productTitle: {
        margin: 0,
        fontSize: '16px',
    },
    productPrice: {
        margin: '5px 0',
        color: '#ff6699',
        fontWeight: 'bold',
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    quantityInput: {
        width: '60px',
        padding: '8px',
        borderRadius: '10px',
        border: '1px solid #ffccdd',
        textAlign: 'center',
    },
    subtotal: {
        minWidth: '100px',
        textAlign: 'right',
        fontWeight: 'bold',
    },
    removeBtn: {
        background: '#ff6666',
        padding: '8px 15px',
        borderRadius: '25px',
        border: 'none',
        cursor: 'pointer',
        color: 'white',
    },
    totalCard: {
        position: 'sticky',
        top: '20px',
        padding: '20px',
        borderRadius: '15px',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    checkoutBtn: {
        width: '100%',
        marginTop: '15px',
        background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default Cart;