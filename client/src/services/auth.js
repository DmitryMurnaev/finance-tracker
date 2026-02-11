import axios from 'axios';

// Базовый URL API (без /auth — общий для всех эндпоинтов)
const API_URL = 'https://finance-tracker-api-hjcz.onrender.com/api';

console.log(`🌍 API базовый URL: ${API_URL}`);
console.log(`📍 Фронтенд: ${window.location.origin}`);

// Создаём экземпляр axios с базовыми настройками
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ------------------------------------------------------
// 1. Перехватчик запросов — добавляет токен авторизации
// ------------------------------------------------------
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    error => Promise.reject(error)
);

// ------------------------------------------------------
// 2. Перехватчик ответов — обрабатывает ошибки 401/403
// ------------------------------------------------------
api.interceptors.response.use(
    response => {
        console.log(
            `✅ Ответ ${response.status}:`,
            response.data?.length ? `${response.data.length} записей` : 'OK'
        );
        return response;
    },
    error => {
        console.error('❌ Ошибка API:', error.message);
        // Если токен недействителен — удаляем его и перенаправляем на страницу входа
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn('🚫 Токен недействителен, выполняем logout');
            localStorage.removeItem('token');
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ------------------------------------------------------
// 3. API для аутентификации
// ------------------------------------------------------
export const authAPI = {
    // Регистрация нового пользователя
    register: async (email, password, name) => {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data; // { user, token }
    },

    // Вход в систему
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data; // { user, token }
    },

    // Получение информации о текущем пользователе
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data; // { id, email, name, created_at }
    },

    // Смена пароля
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post('/auth/change-password', { oldPassword, newPassword });
        return response.data; // { success, message }
    }
};

// ------------------------------------------------------
// 4. API для работы с транзакциями (защищённые маршруты)
// ------------------------------------------------------
export const transactionAPI = {
    // Получить все транзакции текущего пользователя
    getTransactions: async () => {
        const response = await api.get('/transactions');
        return response.data || [];
    },

    // Создать новую транзакцию
    createTransaction: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    },

    // Удалить транзакцию по ID
    deleteTransaction: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },

    // Получить статистику (доходы, расходы, баланс)
    getStatistics: async () => {
        const response = await api.get('/transactions/stats');
        return response.data;
    }
};

// Экспортируем базовый URL для возможного использования в других местах
export { API_URL };