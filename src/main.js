import { createApp } from 'vue';
import App from './App.vue'; // Убедитесь, что путь к App.vue правильный
import router from './router'; // Убедитесь, что путь к роутеру правильный

createApp(App)
  .use(router)
  .mount('#app');