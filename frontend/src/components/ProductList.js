import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            await api.post('/cart/add/', { product_id: productId, quantity: 1 });
            alert('Товар добавлен в корзину');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Ошибка при добавлении в корзину');
        }
    };

    if (loading) return <div>Загрузка...</div>;

    return (
        <div>
            <h2>Наши кондитерские изделия</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        {product.photo && (
                            <img
                                src={`http://localhost:8000${product.photo}`}
                                alt={product.title}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                        )}
                        <h3>{product.title}</h3>
                        <p>{product.price} руб.</p>
                        <p>{product.category_title}</p>
                        <Link to={`/product/${product.id}`}>Подробнее</Link>
                        <button onClick={() => addToCart(product.id)}>В корзину</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;