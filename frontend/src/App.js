import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import ProductList from './components/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

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
                            🛒 Корзина {cartCount > 0 && <span style={{background: '#ff6699', borderRadius: '50%', padding: '2px 8px', marginLeft: '5px'}}>{cartCount}</span>}
                        </Link>
                        <Link to="/orders">📦 Заказы</Link>
                        <button onClick={logout} style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '20px'}}>
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

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{textAlign: 'center', padding: 50}}>🍰 Загрузка...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <Cart />
                        </PrivateRoute>
                    } />
                    <Route path="/checkout" element={
                        <PrivateRoute>
                            <Checkout />
                        </PrivateRoute>
                    } />
                    <Route path="/orders" element={
                        <PrivateRoute>
                            <OrderHistory />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={
                        <PrivateRoute>
                            <ProductList />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
};

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