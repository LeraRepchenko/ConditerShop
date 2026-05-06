import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, currentPage]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                ...(searchTerm && { search: searchTerm })
            };
            const response = await api.get('/products/', { params });

            // Поддержка пагинации от DRF
            if (response.data.results) {
                setProducts(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 10));
                setTotalProducts(response.data.count);
            } else {
                setProducts(response.data);
                setTotalPages(1);
                setTotalProducts(response.data.length);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        const success = await addToCart(productId, 1);
        if (success) {
            alert('🍰 Товар добавлен в корзину!');
        } else {
            alert('❌ Ошибка при добавлении в корзину');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // сбрасываем на первую страницу при поиске
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: 50}}>🍰 Загрузка товаров...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
                <h2>🍰 Наши кондитерские изделия</h2>
                <div style={{position: 'relative'}}>
                    <input
                        type="text"
                        placeholder="🔍 Поиск тортов, пирожных..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{width: '250px', padding: '10px 15px', borderRadius: '30px', border: '2px solid #ffccdd'}}
                    />
                    {searchTerm && (
                        <span
                            onClick={() => setSearchTerm('')}
                            style={{position: 'absolute', right: '15px', top: '10px', cursor: 'pointer', color: '#ff6699'}}
                        >
                            ✕
                        </span>
                    )}
                </div>
            </div>

            {searchTerm && (
                <p style={{marginBottom: '20px', color: '#888'}}>
                    Найдено товаров: {totalProducts}
                </p>
            )}

            {products.length === 0 ? (
                <div style={{textAlign: 'center', padding: 50}}>
                    <p>😔 Ничего не найдено</p>
                    <button onClick={() => setSearchTerm('')}>Сбросить поиск</button>
                </div>
            ) : (
                <>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px'}}>
                        {products.map((product) => (
                            <div key={product.id} className="card">
                                {product.photo && (
                                    <img
                                        src={`http://localhost:8000${product.photo}`}
                                        alt={product.title}
                                        style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px'}}
                                    />
                                )}
                                <h3>{product.title}</h3>
                                <p style={{fontSize: '20px', color: '#ff6699', fontWeight: 'bold'}}>{product.price} ₽</p>
                                <p style={{color: '#888'}}>{product.category_title}</p>
                                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                    <Link to={`/product/${product.id}`} style={{textDecoration: 'none'}}>
                                        <button style={{background: '#ccc', color: '#333'}}>Подробнее</button>
                                    </Link>
                                    <button onClick={() => handleAddToCart(product.id)}>
                                        🛒 В корзину
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px', flexWrap: 'wrap'}}>
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{opacity: currentPage === 1 ? 0.5 : 1}}
                            >
                                ◀ Назад
                            </button>

                            {[...Array(totalPages).keys()].map(i => {
                                const pageNum = i + 1;
                                // Показываем текущую страницу +-2
                                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => goToPage(pageNum)}
                                            style={{
                                                background: pageNum === currentPage ? '#ff6699' : '#ffccdd',
                                                color: pageNum === currentPage ? 'white' : '#4a2c3a'
                                            }}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                                    return <span key={pageNum} style={{padding: '0 5px'}}>...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{opacity: currentPage === totalPages ? 0.5 : 1}}
                            >
                                Вперед ▶
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;