import axios from 'axios';

// ✅ ВАЖНО: для тестового окружения используем dev-бэкенд с /api
const API_URL = 'https://finance-tracker-api-dev.onrender.com/api';

console.log(`🌍 Подключаюсь к API: ${API_URL}`);
console.log(`📍 Фронтенд: ${window.location.origin}`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ============================================
// 1. ПЕРЕХВАТЧИК ЗАПРОСОВ — добавляем токен
// ============================================
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
// 2. ПЕРЕХВАТЧИК ОТВЕТОВ — не редиректим на маршрутах auth
// ============================================
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

        const isAuthRequest = error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register') ||
            error.config?.url?.includes('/auth/send-verification');

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
// 3. API ДЛЯ АУТЕНТИФИКАЦИИ
// ============================================
export const authAPI = {
    // 📧 Отправка кода подтверждения на email
    sendVerificationCode: async (email) => {
        const response = await api.post('/auth/send-verification', { email });
        return response.data;
    },

    // 📝 Регистрация с проверкой кода
    register: async (email, password, name, code) => {
        const response = await api.post('/auth/register', { email, password, name, code });
        return response.data;
    },

    // 🔐 Вход в систему
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // 👤 Получение информации о текущем пользователе
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // 🔑 Смена пароля
    changePassword: async (oldPassword, newPassword) => {
        const response = await api.post('/auth/change-password', { oldPassword, newPassword });
        return response.data;
    }
};

// ============================================
// 4. API ДЛЯ ТРАНЗАКЦИЙ
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