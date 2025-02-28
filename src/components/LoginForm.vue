<template>
    <div class="container">
      <h1>Авторизация</h1>
      <form @submit.prevent="loginUser ">
        <div>
          <label for="email">Почта:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Пароль:</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
          />
          <button type="button" @click="togglePasswordVisibility">
            {{ showPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <button type="submit">Войти</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>
        Еще нет аккаунта? <router-link to="/register">Зарегистрируйтесь здесь</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import http from '../http'; // Импортируем модуль для работы с HTTP запросами
  
  export default {
    name: 'LoginForm',
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
        showPassword: false,
      };
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      async loginUser () {
        this.errorMessage = '';
  
        try {
          const response = await http.post('/login', {
            email: this.email,
            password: this.password,
          });
  
          if (response.status === 200) {
            this.$router.push('/mood-entry'); // Перенаправляем на страницу MoodEntry
          } else {
            this.errorMessage = response.data.message || 'Произошла ошибка. Попробуйте еще раз.';
          }
        } catch (error) {
          console.error('Ошибка при авторизации:', error);
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
  
  .error {
    color: red;
    font-size: 0.9em;
  }
  
  p {
    text-align: center;
  }
  </style>
  