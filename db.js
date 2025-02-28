const { Pool } = require('pg');

// Настройки базы данных
const pool = new Pool({
    user: 'postgres',          // Имя пользователя
    host: 'localhost',         // Хост
    database: 'postgres',      // Имя базы данных
    password: 'postgres',      // Пароль
    port: 5432,                // Порт для PostgreSQL
    connectionTimeout: 10,     // Таймаут подключения в секундах
    // ssl: {                    // Режим SSL (можно убрать, если не нужен)
    //     rejectUnauthorized: false, // Не проверять сертификат
    // },
});

module.exports = pool; // Экспортируем пул подключений
