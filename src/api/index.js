// src/api/index.js
// api.js
let entries = []; // Временное хранилище для записей

export const saveMoodEntry = (entry) => {
  return new Promise((resolve, reject) => {
    try {
      entries.push({ ...entry, date: new Date().toLocaleString() }); // Сохраняем запись с текущей датой
      resolve(); // Успешно сохраняем запись
    } catch (error) {
      reject(new Error('Ошибка при сохранении записи')); // Ошибка сохранения
    }
  });
};

export const fetchMoodEntries = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(entries); // Возвращаем все записи
    } catch (error) {
      reject(new Error('Ошибка при загрузке записей')); // Ошибка загрузки
    }
  });
};
