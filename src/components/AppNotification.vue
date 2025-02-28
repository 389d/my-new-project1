<template>
  <div v-if="visible" class="notification" :class="type" @click="close" @mouseleave="resetTimer">
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "info", // Тип уведомления: 'info', 'success', 'error'
    },
    duration: {
      type: Number,
      default: 3000, // Время, через которое уведомление исчезает (в миллисекундах)
    },
  },
  data() {
    return {
      visible: true, // Переменная, управляющая видимостью уведомления
      timer: null, // Таймер для автоматического закрытия уведомления
    };
  },
  methods: {
    close() {
      this.visible = false; // Метод для закрытия уведомления
      clearTimeout(this.timer); // Очищаем таймер при закрытии
    },
    resetTimer() {
      clearTimeout(this.timer); // Очищаем существующий таймер
      this.timer = setTimeout(() => {
        this.close(); // Закрываем уведомление через заданный интервал
      }, this.duration);
    },
  },
  mounted() {
    this.resetTimer(); // Устанавливаем таймер при монтировании
  },
  beforeUnmount() {
    clearTimeout(this.timer); // Очищаем таймер при уничтожении компонента
  },
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* Указывает на то, что уведомление кликабельно */
  z-index: 1000; /* Убедитесь, что уведомления отображаются поверх других элементов */
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notification.info {
  border-color: blue; /* Синие границы для информационных уведомлений */
}

.notification.success {
  border-color: green; /* Зеленые границы для успешных уведомлений */
}

.notification.error {
  border-color: red; /* Красные границы для уведомлений об ошибках */
}

.notification[style*="opacity: 0"] {
  transform: translateY(-10px); /* Уведомление немного поднимается при скрытии */
}
</style>
