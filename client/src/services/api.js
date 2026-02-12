import axios from 'axios';

// ✅ для тестового окружения используем dev-бэкенд
const API_URL = 'https://finance-tracker-api-dev.onrender.com/api';

console.log(`🌍 Подключаюсь к API: ${API_URL}`);
console.log(`📍 Фронтенд: ${window.location.origin}`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// Перехватчик запросов — добавляет токен
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    error => Promise.reject(error)
);

// ============================================
// ✅ ИСПРАВЛЕННЫЙ ПЕРЕХВАТЧИК ОТВЕТОВ
// ============================================
api.interceptors.response.use(
    response => {
        console.log(`✅ Ответ ${response.status}:`, response.data?.length ? `${response.data.length} записей` : 'OK');
        return response;
    },
    error => {
        console.error('❌ Ошибка API:', error.message);

        // 🟢 НЕ РЕДИРЕКТИМ на маршрутах аутентификации и смены пароля!
        const isAuthRequest =
            error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register') ||
            error.config?.url?.includes('/auth/send-verification') ||
            error.config?.url?.includes('/auth/change-password'); // ✅ Добавлено!

        if (!isAuthRequest && (error.response?.status === 401 || error.response?.status === 403)) {
            console.warn('🚫 Токен недействителен, выполняем logout');
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ============================================
// API ДЛЯ АУТЕНТИФИКАЦИИ (без кода)
// ============================================
export const authAPI = {
    register: async (email, password, name) => {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data;
    },
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post('/auth/change-password', { oldPassword, newPassword });
        return response.data;
    }
};

// ============================================
// API ДЛЯ ТРАНЗАКЦИЙ (без изменений)
// ============================================
export const transactionAPI = {
    getTransactions: async () => {
        try {
            const response = await api.get('/transactions');
            return response.data || [];
        } catch (error) {
            console.error('Ошибка загрузки транзакций:', error.message);
            if (!localStorage.getItem('token')) {
                return [];
            }
            throw error;
        }
    },
    createTransaction: async (transactionData) => {
        try {
            const response = await api.post('/transactions', transactionData);
            return response.data;
        } catch (error) {
            console.error('Ошибка создания транзакции:', error.message);
            throw error;
        }
    },
    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления транзакции:', error.message);
            throw error;
        }
    },
    getStatistics: async () => {
        try {
            const response = await api.get('/transactions/stats');
            return response.data;
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error.message);
            return { income: { total: 0 }, expense: { total: 0 }, balance: 0 };
        }
    }
};

export { API_URL };