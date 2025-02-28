const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,             // указываем порт, как обычно
    allowedHosts: 'all',      // пускаем любые домены, чтоб ngrok не пугался
    https: true,              // вот эта настройка – включаем HTTPS для dev-сервера
  }
})