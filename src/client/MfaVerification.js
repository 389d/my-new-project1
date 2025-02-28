import React, { useState } from 'react';
import axios from 'axios';

const MfaVerification = ({ userId, onMfaSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleMfaVerification = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/verify-mfa', { userId, userInputCode: code });
            // Если верификация успешна, вы можете сохранить токен или переходить на другую страницу
            localStorage.setItem('token', response.data.token);
            onMfaSuccess(); // Вызов функции после успешной верификации
        } catch (err) {
            setError('Неверный MFA код: ' + (err.response?.data || 'Неизвестная ошибка'));
        }
    };

    return (
        <div>
            <h2>Введите код MFA</h2>
            <form onSubmit={handleMfaVerification}>
                <div>
                    <label>Код:</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Подтвердить код</button>
            </form>
        </div>
    );
};

export default MfaVerification;
