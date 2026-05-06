import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProductList from './components/ProductList';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <h1>🍰 Вкусняшка</h1>
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;