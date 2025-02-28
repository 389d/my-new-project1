<template>
    <div class="notification" :class="type">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseNotification', // Убедитесь, что имя компонента также изменено
    props: {
      message: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'info'
      }
    }
  };
  </script>
  
  <style scoped>
  .notification {
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
  }
  .success {
    background-color: #d4edda;
    color: #155724;
  }
  .error {
    background-color: #f8d7da;
    color: #721c24;
  }
  </style>