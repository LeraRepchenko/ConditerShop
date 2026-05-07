import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import ProductList from './components/ProductList';
import ProductDetailPage from './pages/ProductDetailPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

// Компонент навигации
const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <nav className="navbar">
            <div className="logo">
                🍰 Вкусняшка
            </div>
            <div className="nav-links">
                <Link to="/">Главная</Link>
                {user ? (
                    <>
                        <Link to="/cart">
                            🛒 Корзина {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                        </Link>
                        <Link to="/orders">📦 Заказы</Link>
                        <Link to="/profile">👤 Профиль</Link>
                        <button onClick={logout} style={styles.logoutBtn}>
                            Выйти 👋
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Вход</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

// Компонент для защищённых маршрутов
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}>🍰 Загрузка...</div>;
    return user ? children : <Navigate to="/login" />;
};

// Основной компонент приложения
const AppContent = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    {/* Публичные страницы (доступны без входа) */}
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />

                    {/* Страницы входа и регистрации */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Защищённые страницы (требуют авторизации) */}
                    <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    );
};

// Стили для навигации
const styles = {
    cartBadge: {
        background: '#ff6699',
        borderRadius: '50%',
        padding: '2px 8px',
        marginLeft: '5px',
        fontSize: '12px',
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        marginLeft: '20px',
        fontSize: '16px',
    },
};

// Корневой компонент
const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
};

export default App;