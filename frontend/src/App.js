import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProductList from './components/ProductList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Загрузка...</div>;
    return user ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <h1 style={{ textAlign: 'center', padding: '20px', backgroundColor: '#2c3e50', color: 'white', margin: 0 }}>
                        🍰 Вкусняшка
                    </h1>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <ProductList />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;