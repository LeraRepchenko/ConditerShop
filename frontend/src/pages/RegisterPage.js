import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.password2) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            await api.post('/auth/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                password2: formData.password2,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            navigate('/login');
        } catch (err) {
            if (err.response?.data) {
                const errors = Object.values(err.response.data).flat();
                setError(errors.join(' '));
            } else {
                setError('Ошибка при регистрации');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2>Регистрация</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label>Имя пользователя *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Имя</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Фамилия</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Пароль *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Подтверждение пароля *</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p style={styles.loginLink}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        marginTop: '5px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    error: {
        backgroundColor: '#fee',
        color: '#c33',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    loginLink: {
        marginTop: '15px',
        textAlign: 'center',
    },
};

export default RegisterPage;