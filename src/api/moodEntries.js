const express = require('express');
const cors = require('cors'); // Импортируем пакет cors
const bodyParser = require('body-parser'); // Импортируем body-parser для обработки JSON

const app = express();
const PORT = 3000;

// Используем CORS для разрешения кросс-доменных запросов
app.use(cors());

// Используем body-parser для обработки JSON
app.use(bodyParser.json());

// Временное хранилище для записей о настроении
let entries = []; // Здесь будет храниться массив записей

// Маршрут для получения всех записей о настроении
app.get('/api/mood-entries', (req, res) => {
  res.json(entries); // Возвращаем все записи
});

// Маршрут для сохранения новой записи о настроении
app.post('/api/mood-entries', (req, res) => {
  const { emotions, description } = req.body;
  const newEntry = {
    emotions,
    description,
    date: new Date().toLocaleString(),
  };

  entries.push(newEntry); // Сохраняем новую запись
  res.status(201).json(newEntry); // Отправляем статус 201 и новую запись
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
