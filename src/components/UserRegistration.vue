<template>
  <div class="container">
    <h1>{{ isLogin ? 'Регистрация' : 'Авторизация' }}</h1>
    <form @submit.prevent="isLogin ? registerUser () : loginUser ()">
      <div v-if="isLogin">
        <label for="name">Имя:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div>
        <label for="email">Почта:</label>
        <input type="email" id="email" v-model="email" @input="checkEmail" required />
        <p v-if="emailError" class="error">Введите корректный адрес электронной почты.</p>
      </div>
      <div>
        <label for="password">Пароль:</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          @input="checkPassword"
          required
        />
        <button type="button" @click="togglePasswordVisibility">
          {{ showPassword ? 'Скрыть' : 'Показать' }}
        </button>
        <p v-if="passwordError" class="error">Пароль должен содержать минимум 8 символов и включать английские буквы.</p>
      </div>
      <button type="submit" :disabled="emailError || passwordError">{{ isLogin ? 'Зарегистрироваться' : 'Войти' }}</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>
      {{ isLogin ? 'Уже есть аккаунт?' : 'Еще нет аккаунта?' }}
      <router-link to="#" @click.prevent="toggleForm">{{ isLogin ? 'Войдите здесь' : 'Зарегистрируйтесь здесь' }}</router-link>
    </p>
  </div>
</template>

<script>
import http from '../http'; // Импортируем модуль для работы с HTTP запросами

export default {
  name: 'AuthForm',
  data() {
    return {
      isLogin: true, // Начальное состояние - авторизация
      name: '',
      email: '',
      password: '',
      errorMessage: '',
      passwordError: false,
      emailError: false,
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validatePassword(password) {
      const passwordPattern = /^(?=.*[a-zA-Z]).{8,}$/; // Пароль должен содержать минимум 8 символов и хотя бы одну букву
      return passwordPattern.test(password);
    },
    checkPassword() {
      this.passwordError = !this.validatePassword(this.password);
    },
    validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Проверка на корректный формат почты
      return emailPattern.test(email);
    },
    checkEmail() {
      this.emailError = !this.validateEmail(this.email);
    },
    toggleForm() {
      this.isLogin = !this.isLogin; // Переключение между формами
      this.resetForm(); // Сброс формы при переключении
    },
    async loginUser () {
      this.errorMessage = '';

      try {
        // Здесь указываем полный URL для авторизации
        const response = await http.post('http://localhost:8000/api/login', {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          window.location.href = 'file:///C:/Users/petuh/Documents/my_django_project/myapp/templates/home.html'; // Переход на home.html
        } else {
          this.errorMessage = response.data.message || 'Произошла ошибка. Попробуйте еще раз.';
        }
      } catch (error) {
        console.error('Ошибка при авторизации:', error);
        this.handleError(error);
      }
    },
    async registerUser () {
  // Проверяем наличие ошибок перед отправкой формы
  if (this.passwordError || this.emailError) {
    this.errorMessage = 'Исправьте ошибки перед отправкой формы.';
    return;
  }

      this.errorMessage = '';

      try {
        // Здесь указываем полный URL для регистрации
        const response = await http.post('http://localhost:8000/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });

        // Проверяем статус ответа
        if (response.status === 201) {
          this.errorMessage = 'Регистрация успешна! Теперь вы можете войти';
          this.resetForm(); // Сбрасываем форму после успешной регистрации
          window.location.href = 'file:///C:/Users/petuh/Documents/my_django_project/myapp/templates/home.html'; // Переход на home.html
        } else {
          // Если статус не 201, обрабатываем ошибку
          this.errorMessage = response.data.message || 'Произошла ошибка. Попробуйте еще раз.';
        }
      } catch (error) {
        // Обработка ошибки
        console.error('Ошибка при регистрации:', error);
        this.handleError(error);
      }
    },
    handleError(error) {
      if (error.response) {
        this.errorMessage = error.response.data.message || 'Произошла ошибка на сервере. Попробуйте еще раз.';
      } else if (error.request) {
        this.errorMessage = 'Нет ответа от сервера. Проверьте подключение к интернету.';
      } else {
        this.errorMessage = 'Ошибка: ' + error.message;
      }
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.errorMessage = '';
      this.passwordError = false;
      this.emailError = false; // Сброс ошибки почты
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h1 {
  text-align: center;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.error {
  color: red;
  font-size: 0.9em;
}

p {
  text-align: center;
}
</style>

