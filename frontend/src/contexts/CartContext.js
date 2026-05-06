import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart/');
            setCart(response.data);
            const count = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            setCartCount(count);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await api.post('/cart/add/', { product_id: productId, quantity });
            await fetchCart();  // обновляем корзину после добавления
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await api.patch(`/cart/update/${itemId}/`, { quantity });
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Error updating quantity:', error);
            return false;
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}/`);
            await fetchCart();
            return true;
        } catch (error) {
            console.error('Error removing item:', error);
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeItem, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};