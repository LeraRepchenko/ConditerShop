import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import CategoryList from './CategoryList';


const getImageUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('http')) return photo;
    if (photo.startsWith('/media/')) return `http://localhost:8000${photo}`;
    if (photo.startsWith('media/')) return `http://localhost:8000/${photo}`;
    return `http://localhost:8000/media/${photo}`;
};

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // ← добавляем
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const { addToCart } = useCart();


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    useEffect(() => {
        fetchProducts();
    }, [debouncedSearchTerm, currentPage, selectedCategory, sortBy]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(selectedCategory && { category: selectedCategory }),
                ...(sortBy === 'price_asc' && { ordering: 'price' }),
                ...(sortBy === 'price_desc' && { ordering: '-price' }),
                ...(sortBy === 'newest' && { ordering: '-created_at' }),
            };
            const response = await api.get('/products/', { params });

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

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

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
            <div style={styles.header}>
                <h2>🍰 Наши кондитерские изделия</h2>
                <div style={styles.controls}>
                    <div style={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="🔍 Поиск..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={styles.searchInput}
                            autoFocus
                        />
                        {searchTerm && (
                            <span
                                onClick={() => {
                                    setSearchTerm('');
                                    setDebouncedSearchTerm('');
                                }}
                                style={styles.clearSearch}
                            >
                                ✕
                            </span>
                        )}
                    </div>
                    <select value={sortBy} onChange={handleSortChange} style={styles.select}>
                        <option value="">📊 Сортировка</option>
                        <option value="price_asc">💰 По возрастанию цены</option>
                        <option value="price_desc">💰 По убыванию цены</option>
                        <option value="newest">🆕 Сначала новинки</option>
                    </select>
                </div>
            </div>

            <CategoryList onSelectCategory={handleCategorySelect} selectedCategory={selectedCategory} />

            {debouncedSearchTerm && (
                <p style={styles.resultCount}>
                    Найдено товаров: {totalProducts}
                </p>
            )}

            {products.length === 0 ? (
                <div style={styles.empty}>
                    <p>😔 Ничего не найдено</p>
                    <button onClick={() => {
                        setSearchTerm('');
                        setDebouncedSearchTerm('');
                        setSelectedCategory(null);
                        setSortBy('');
                    }}>Сбросить фильтры</button>
                </div>
            ) : (
                <>
                    <div style={styles.grid}>
                        {products.map((product) => (
                            <div key={product.id} className="card" style={styles.card}>
                                {product.photo && (
                                    <img src={getImageUrl(product.photo)} alt={product.title} style={styles.cardImage} />
                                )}
                                {!product.photo && <div style={styles.noImage}>🍰</div>}

                                <h3>{product.title}</h3>
                                <p style={styles.price}>{product.price} ₽</p>
                                <p style={styles.category}>{product.category_title}</p>

                                {!product.is_available && (
                                    <p style={styles.soldOut}>❌ Нет в наличии</p>
                                )}

                                <div style={styles.cardButtons}>
                                    <Link to={`/product/${product.id}`} style={styles.detailLink}>
                                        <button style={styles.detailBtn}>Подробнее</button>
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        disabled={!product.is_available}
                                        style={{
                                            ...styles.cartBtn,
                                            opacity: product.is_available ? 1 : 0.5
                                        }}
                                    >
                                        🛒 В корзину
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={styles.pagination}>
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                ◀ Назад
                            </button>
                            {[...Array(totalPages).keys()].map(i => {
                                const pageNum = i + 1;
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
                                    return <span key={pageNum}>...</span>;
                                }
                                return null;
                            })}
                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                Вперед ▶
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' },
    controls: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' },
    searchBox: { position: 'relative' },
    searchInput: { padding: '10px 15px', borderRadius: '30px', border: '2px solid #ffccdd', fontSize: '14px', width: '220px' },
    clearSearch: { position: 'absolute', right: '15px', top: '10px', cursor: 'pointer', color: '#ff6699' },
    select: { padding: '10px 15px', borderRadius: '30px', border: '2px solid #ffccdd', fontSize: '14px', background: 'white', cursor: 'pointer' },
    resultCount: { marginBottom: '20px', color: '#888' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' },
    card: { padding: '15px', textAlign: 'center', background: 'white', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    cardImage: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '15px' },
    noImage: { width: '100%', height: '200px', background: '#ffccdd', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
    price: { fontSize: '20px', color: '#ff6699', fontWeight: 'bold' },
    category: { color: '#888', fontSize: '12px' },
    soldOut: { color: '#ff6666', marginTop: '10px', fontWeight: 'bold', fontSize: '14px' },
    cardButtons: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' },
    detailLink: { textDecoration: 'none' },
    detailBtn: { background: '#ccc', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '25px', cursor: 'pointer' },
    cartBtn: { background: 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '25px', cursor: 'pointer' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px', flexWrap: 'wrap' },
    empty: { textAlign: 'center', padding: '50px' }
};

export default ProductList;