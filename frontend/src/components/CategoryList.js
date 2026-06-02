import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryList = ({ onSelectCategory, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories/');

            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (response.data.results && Array.isArray(response.data.results)) {
                setCategories(response.data.results);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return null;
    if (!categories || categories.length === 0) return null;

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <button
                    onClick={() => onSelectCategory(null)}
                    style={{
                        ...styles.categoryBtn,
                        background: !selectedCategory ? 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)' : '#ffe6f0',
                        color: !selectedCategory ? 'white' : '#4a2c3a',
                        boxShadow: !selectedCategory ? '0 4px 15px rgba(255,105,180,0.3)' : 'none'
                    }}
                >
                    🍰 Все товары
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        style={{
                            ...styles.categoryBtn,
                            background: selectedCategory === category.id ? 'linear-gradient(135deg, #ff99bb 0%, #ff6699 100%)' : '#ffe6f0',
                            color: selectedCategory === category.id ? 'white' : '#4a2c3a',
                            boxShadow: selectedCategory === category.id ? '0 4px 15px rgba(255,105,180,0.3)' : 'none'
                        }}
                    >
                        {category.title}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '30px',
        borderBottom: '2px solid #ffccdd',
        paddingBottom: '15px',
        overflowX: 'auto',
    },
    wrapper: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    categoryBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '30px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
    },
};

export default CategoryList;