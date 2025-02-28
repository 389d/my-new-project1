import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/login', { email, password });
            // Если вход успешен, вызовем функцию обратного вызова
            onLoginSuccess(response.data.userId); // Передача userId для следующего шага
        } catch (err) {
            setError('Ошибка входа: ' + (err.response?.data || 'Неизвестная ошибка'));
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Login;
