// http.js
import axios from 'axios';

const http = axios.create({
  baseURL: 'https://your-api-url.com/api', // Замените на ваш базовый URL API с HTTPS
  timeout: 10000, // Установите тайм-аут в миллисекундах
});

// Можно добавить обработку ошибок по умолчанию
http.interceptors.response.use(
  response => response,
  error => {
    // Обработка ошибок
    console.error('HTTP Error:', error);
    return Promise.reject(error);
  }
);

export default http;
