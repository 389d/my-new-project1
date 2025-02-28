<template>
  <div id="app">
    <UserRegistration /> <!-- Обновлено имя -->
    <MoodEntry />
   
  </div>
</template>

<script>
import UserRegistration from './components/UserRegistration.vue'; // Обновлено имя
import MoodEntry from './components/MoodEntry.vue';


export default {
  name: 'App',
  components: {
    UserRegistration, // Обновлено имя
    MoodEntry,
     
  },
};
</script>

<style>
/* Ваши стили */
</style>
