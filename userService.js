const pool = require('./db'); // Импортируем подключение к базе данных
const bcrypt = require('bcrypt'); // Импортируем bcrypt для шифрования паролей

// Функция для получения пользователя по адресу электронной почты
async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = \$1'; // \$1 - это параметр
    const values = [email];

    try {
        const res = await pool.query(query, values); // Выполняем запрос с параметрами
        return res.rows[0]; // Возвращаем найденного пользователя
    } catch (err) {
        console.error('Ошибка при выборке пользователя:', err);
        throw err; // Можно пробросить ошибку выше
    }
}

// Функция для проверки пароля
async function validatePassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

// Функция для входа пользователя
async function loginUser (email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Пользователь с таким адресом электронной почты не найден.');
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
        throw new Error('Неверный пароль.');
    }

    console.log('Пользователь успешно вошел в систему:', user.email);
    return user; // Возвращаем пользователя при успешном входе
}

// Пример использования
(async () => {
    try {
        const email = 'catn9386@gmail.com'; // Замените на реальный e-mail
        const password = 'ваш_пароль'; // Замените на реальный пароль

        const user = await loginUser (email, password);
        console.log('Данные пользователя:', user);
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
})();
