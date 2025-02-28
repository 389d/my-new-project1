<template>
  <div class="mood-entry-container">
    <div class="mood-entry">
      <h2>{{ isEditing ? 'Редактировать запись о настроении' : 'Добавить запись о настроении' }}</h2>

      <div class="emotions">
        <h3>Выберите эмоцию:</h3>
        <div class="emotion-options">
          <label v-for="emotion in emotions" :key="emotion" class="emotion-label">
            <input
              type="checkbox"
              :value="emotion"
              v-model="selectedEmotions"
              class="emotion-checkbox"
            />
            <span class="emotion-text">{{ emotion }}</span>
          </label>
        </div>
      </div>

      <div class="description">
        <h3>Опишите свой день:</h3>
        <textarea v-model="description" rows="4" placeholder="Опишите свой день:" required></textarea>
   
      </div>

      <button class="save-button" @click="submitEntry">
        {{ isEditing ? 'Сохранить изменения' : 'Сохранить запись' }}
      </button>

      <div class="recommendations" v-if="selectedEmotions.length > 0">
        <h3>Рекомендации:</h3>
        <ul>
          <li v-for="recommendation in getRecommendations()" :key="recommendation">{{ recommendation }}</li>
        </ul>
      </div>

      <div class="saved-entries">
        <h3>Сохраненные записи: {{ entries.length }}</h3>
        <div class="entry-list">
          <div v-for="entry in entries" :key="entry.date" class="entry-item">
            <strong class="entry-date">{{ entry.date }}</strong>
            <div class="entry-content">
              <p class="entry-description">{{ entry.description }}</p>
              <p class="entry-emotions">Эмоции: <span class="emotion-list">{{ entry.emotions.join(', ') }}</span></p>
              <button class="edit-button" @click="editEntry(entry)">Редактировать</button>
              <button class="delete-button" @click="deleteEntry(entry)">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveMoodEntry, fetchMoodEntries } from '../api'; // Импортируем функции из API

export default {
  name: 'MoodEntry',
  data() {
    return {
      emotions: ['Счастлив', 'Грустный', 'Волнующийся', 'Сердитый'],
      selectedEmotions: [],
      description: '',
      entries: [], // Массив для хранения сохраненных записей
      isEditing: false, // Состояние для отслеживания редактирования
      editingEntry: null, // Запись, которую редактируем
    };
  },
  methods: {
    async submitEntry() {
      if (!this.description) {
        alert('Описание не может быть пустым!'); // Проверка на пустое поле
        return;
      }

      // Проверка на максимальное количество символов
      if (this.description.length > 100) {
        alert('Описание не может превышать 100 знаков!');
        return;
      }

      // Проверка на наличие английских символов
      const englishLetterPattern = /[a-zA-Z]/;
      if (englishLetterPattern.test(this.description)) {
        alert('Недопустимые символы! Описание должно содержать только русские буквы.');
        return;
      }

      const moodEntry = {
        emotions: this.selectedEmotions,
        description: this.description,
        date: new Date().toLocaleString(), // Добавляем текущую дату
      };

      try {
        if (this.isEditing) {
          // Если редактируем запись, обновляем ее
          const index = this.entries.findIndex(entry => entry.date === this.editingEntry.date);
          if (index !== -1) {
            this.entries[index] = moodEntry; // Обновляем запись в массиве
          }
          this.isEditing = false; // Сбрасываем состояние редактирования
               alert('Запись успешно обновлена');
        } else {
          await saveMoodEntry(moodEntry); // Сохраняем запись через API
          this.entries.unshift(moodEntry); // Добавляем новую запись в начало списка
          alert('Запись успешно сохранена');
        }
        this.resetForm(); // Сброс формы после сохранения
        this.saveEntriesToLocalStorage(); // Сохраняем записи в localStorage
      } catch (error) {
        console.error('Ошибка при сохранении записи:', error);
        alert('Произошла ошибка при сохранении записи. Попробуйте еще раз.');
      }
    },
    resetForm() {
      this.selectedEmotions = [];
      this.description = '';
      this.editingEntry = null; // Сброс редактируемой записи
    },
    async fetchEntries() {
      try {
        // Получаем записи из API
        this.entries = await fetchMoodEntries();
        // Загружаем записи из localStorage, если они есть
        const storedEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        this.entries = [...storedEntries, ...this.entries]; // Объединяем записи из localStorage и API
        this.entries.sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортируем записи по дате (новые в начале)
      } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
      }
    },
    saveEntriesToLocalStorage() {
      localStorage.setItem('moodEntries', JSON.stringify(this.entries)); // Сохраняем записи в localStorage
    },
    editEntry(entry) {
      this.description = entry.description;
      this.selectedEmotions = entry.emotions;
      this.isEditing = true; // Устанавливаем состояние редактирования
      this.editingEntry = entry; // Сохраняем редактируемую запись
    },
    deleteEntry(entry) {
      const index = this.entries.findIndex(e => e.date === entry.date);
      if (index !== -1) {
        this.entries.splice(index, 1); // Удаляем запись из массива
        this.saveEntriesToLocalStorage(); // Обновляем localStorage
        alert('Запись успешно удалена');
      }
    },
    getRecommendations() {
      const recommendations = [];
      
      if (this.selectedEmotions.includes('Счастлив')) {
        recommendations.push('Продолжайте делать то, что приносит вам радость!');
      }
      if (this.selectedEmotions.includes('Грустный')) {
        recommendations.push('Попробуйте заняться чем-то, что вас отвлечет, например, прогулкой или чтением книги.');
      }
      if (this.selectedEmotions.includes('Волнующийся')) {
        recommendations.push('Попробуйте медитацию или дыхательные упражнения для расслабления.');
      }
      if (this.selectedEmotions.includes('Сердитый')) {
        recommendations.push('Постарайтесь поговорить с кем-то о своих чувствах или заняться физической активностью.');
      }
      
      return recommendations;
    },
  },
  mounted() {
    this.fetchEntries(); // Загружаем записи при монтировании компонента
  },
};
</script>

<style>
/* Стили для контейнера приложения */
.mood-entry-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Заполняем всю высоту экрана */
  background-color: #f0f0f0; /* Фоновый цвет */
}

.mood-entry {
  background-color: #fff;
  border: 2px solid #007BFF; /* Обводка контейнера */
  border-radius: 8px; /* Скругление углов */
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Тень для контейнера */
  width: 500px; /* Увеличенная ширина контейнера */
  max-width: 90%; /* Максимальная ширина для мобильных устройств */
}

h2, h3 {
  margin: 0 0 10px;
  font-family: 'Arial', sans-serif; /* Шрифт заголовков */
}

.emotion-options {
  display: flex;
  flex-wrap: wrap; /* Позволяет элементам переноситься на новую строку */
  margin-bottom: 15px; /* Отступ снизу */
}

.emotion-label {
  margin-right: 10px; /* Отступ между эмоциями */
  font-size: 1.1em; /* Увеличенный размер шрифта */
  color: #333; /* Цвет текста */
  display: flex;
  align-items: center; /* Выравнивание по вертикали */
}

.emotion-checkbox {
  margin-right: 5px; /* Отступ между чекбоксом и текстом */
}

.description {
  margin-bottom: 15px; /* Отступ снизу */
}

textarea {
  width: 100%; /* Занимает всю ширину контейнера */
  padding: 10px; /* Отступ внутри текстового поля */
  border: 1px solid #ccc; /* Обводка текстового поля */
  border-radius: 4px; /* Скругление углов */
  font-size: 1em; /* Размер шрифта */
}

.character-count {
  font-size: 0.9em; /* Размер шрифта для счетчика символов */
  color: #666; /* Цвет текста для счетчика */
  text-align: right; /* Выравнивание по правому краю */
}

.save-button {
  background-color: #007BFF; /* Цвет кнопки */
  color: white; /* Цвет текста кнопки */
  border: none; /* Убираем обводку */
  border-radius: 4px; /* Скругление углов кнопки */
  padding: 10px 15px; /* Отступы внутри кнопки */
  cursor: pointer; /* Курсор в виде указателя */
  margin-bottom: 15px; /* Отступ снизу */
}

.save-button:hover {
  background-color: #0056b3; /* Цвет кнопки при наведении */
}

.saved-entries {
  margin-top: 20px; /* Отступ сверху */
}

.entry-list {
  max-height: 200px; /* Ограничиваем высоту списка записей */
  overflow-y: auto; /* Добавляем прокрутку */
}

.entry-item {
  border-bottom: 1px solid #ccc; /* Обводка между записями */
  padding: 10px 0; /* Отступы сверху и снизу */
}

.entry-date {
  font-weight: bold; /* Жирный шрифт для даты */
}

.entry-description {
  margin: 5px 0; /* Отступы сверху и снизу */
}

.entry-emotions {
  font-style: italic; /* Курсив для эмоций */
}

.edit-button, .delete-button {
  background-color: #28a745; /* Цвет кнопки редактирования */
  color: white; /* Цвет текста кнопки */
  border: none; /* Убираем обводку */
  border-radius: 4px; /* Скругление углов кнопки */
  padding: 5px 10px; /* Отступы внутри кнопки */
  cursor: pointer; /* Курсор в виде указателя */
  margin-right: 5px; /* Отступ между кнопками */
}

.edit-button:hover {
  background-color: #218838; /* Цвет кнопки редактирования при наведении */
}

.delete-button {
  background-color: #dc3545; /* Цвет кнопки удаления */
}

.delete-button:hover {
  background-color: #c82333; /* Цвет кнопки удаления при наведении */
}
</style>

