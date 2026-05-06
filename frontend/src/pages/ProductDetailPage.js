import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}/`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const success = await addToCart(product.id, quantity);
        if (success) {
            alert(`🍰 ${product.title} добавлен в корзину!`);
        } else {
            alert('❌ Ошибка при добавлении в корзину');
        }
    };

    const handleBuyNow = () => {
        addToCart(product.id, quantity);
        navigate('/cart');
    };

    if (loading) return <div style={styles.center}>🍰 Загрузка...</div>;
    if (!product) return <div style={styles.center}>😔 Товар не найден</div>;

    // Формируем правильный путь к картинке
    const imageUrl = product.photo
        ? `http://localhost:8000${product.photo}`
        : null;

    return (
        <div style={styles.container}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                ← Назад
            </button>

            <div style={styles.productCard}>
                <div style={styles.imageSection}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={product.title} style={styles.image} />
                    ) : (
                        <div style={styles.noImage}>🍰</div>
                    )}
                </div>

                <div style={styles.infoSection}>
                    <h1 style={styles.title}>{product.title}</h1>
                    <p style={styles.category}>
                        📁 {product.category_title || 'Без категории'}
                    </p>
                    <p style={styles.price}>{product.price} ₽</p>

                    <div style={styles.description}>
                        <h3>🍰 Описание</h3>
                        <p>{product.description || 'Описание отсутствует'}</p>
                    </div>

                    <div style={styles.actions}>
                        <div style={styles.quantitySelector}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={styles.qtyBtn}
                            >
                                -
                            </button>
                            <span style={styles.quantity}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                style={styles.qtyBtn}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            style={styles.cartBtn}
                            disabled={!product.is_available}
                        >
                            🛒 Добавить в корзину
                        </button>

                        <button
                            onClick={handleBuyNow}
                            style={styles.buyBtn}
                            disabled={!product.is_available}
                        >
                            💳 Купить сейчас
                        </button>
                    </div>

                    {!product.is_available && (
                        <p style={styles.soldOut}>❌ Товар временно отсутствует</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
    },
    center: {
        textAlign: 'center',
        padding: '50px',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: '#ff6699',
        marginBottom: '20px',
        padding: '8px 16px',
        borderRadius: '25px',
        backgroundColor: '#ffe6f0',
    },
    productCard: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
    },
    imageSection: {
        flex: 1,
        minWidth: '280px',
    },
    image: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '15px',
    },
    noImage: {
        width: '100%',
        height: '300px',
        background: '#ffccdd',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '60px',
    },
    infoSection: {
        flex: 1,
        minWidth: '280px',
    },
    title: {
        fontSize: '28px',
        color: '#4a2c3a',
        marginBottom: '10px',
    },
    category: {
        color: '#888',
        marginBottom: '15px',
    },
    price: {
        fontSize: '32px',
        color: '#ff6699',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    description: {
        marginBottom: '30px',
        borderTop: '1px solid #ffccdd',
        paddingTop: '20px',
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
    },
    quantitySelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        border: '1px solid #ffccdd',
        borderRadius: '30px',
        padding: '5px 15px',
    },
    qtyBtn: {
        background: '#ffe6f0',
        border: 'none',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        fontSize: '18px',
        cursor: 'pointer',
    },
    quantity: {
        fontSize: '18px',
        minWidth: '30px',
        textAlign: 'center',
    },
    cartBtn: {
        background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buyBtn: {
        background: 'linear-gradient(135deg, #ffcc66 0%, #ff9933 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    soldOut: {
        color: '#ff6666',
        marginTop: '15px',
        fontWeight: 'bold',
    },
};

export default ProductDetailPage;