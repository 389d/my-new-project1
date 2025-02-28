import React, { useState } from 'react';
import Login from './Login'; // Login
import MfaVerification from './MfaVerification'; // MfaVerification

const App = () => {
    const [userId, setUserId] = useState(null); // Исправлено: убран пробел
    const [isMfaRequired, setIsMfaRequired] = useState(false);

    const handleLoginSuccess = (id) => {
        setUserId(id); // Исправлено: убран пробел
        setIsMfaRequired(true); 
    };

    const handleMfaSuccess = () => {
        alert('Вход успешен!');
    };

    return (
        <div>
            {isMfaRequired ? (
                <MfaVerification userId={userId} onMfaSuccess={handleMfaSuccess} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;
