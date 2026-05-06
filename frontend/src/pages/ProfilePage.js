import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        bio: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.put('/auth/profile/', formData);
            if (updateProfile) {
                await updateProfile(formData);
            }
            setMessage('✅ Профиль успешно обновлён!');
        } catch (err) {
            console.error('Update error:', err);
            setError('❌ Ошибка при обновлении профиля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <h2>👤 Мой профиль</h2>
            <p style={{color: '#888', marginBottom: '20px'}}>
                Добро пожаловать, {user?.username}!
            </p>

            <form onSubmit={handleSubmit} className="card">
                {message && <div style={{color: 'green', marginBottom: '15px', textAlign: 'center'}}>{message}</div>}
                {error && <div style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

                <div style={{marginBottom: '15px'}}>
                    <label>📧 Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>👶 Имя</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>👨‍👩 Фамилия</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>📞 Телефон</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+7 (XXX) XXX-XX-XX"
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>📝 О себе</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Расскажите о своих предпочтениях в сладостях..."
                    />
                </div>

                <button type="submit" disabled={loading} style={{width: '100%'}}>
                    {loading ? 'Сохранение...' : '💾 Сохранить изменения'}
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;