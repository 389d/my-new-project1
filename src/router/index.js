import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue'; // Убедитесь, что файл существует
import UserRegistration from '../components/UserRegistration.vue'; // Исправлено имя компонента
import AppNotification from '../components/AppNotification.vue';
import MoodEntry from '../components/MoodEntry.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage, // Использование HomePage
    },
    {
        path: '/register',
        name: 'Registration',
        component: UserRegistration, // Используем UserRegistration
    },
    {
        path: '/notification',
        name: 'AppNotification',
        component: AppNotification,
    },
    {
        path: '/mood-entry',
        name: 'MoodEntry',
        component: MoodEntry,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
