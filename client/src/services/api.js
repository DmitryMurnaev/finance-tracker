import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

    transfer: async (data) => {
        const response = await api.post('/transactions/transfer', data);
        return response.data;
    },
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

    updateTransaction: async (id, transactionData) => {
        try {
            const response = await api.put(`/transactions/${id}`, transactionData);
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления транзакции:', error.message);
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

export const categoryAPI = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },
    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

export const accountAPI = {
    getAccounts: async () => {
        const response = await api.get('/accounts');
        return response.data;
    },
    createAccount: async (data) => {
        const response = await api.post('/accounts', data);
        return response.data;
    },
    updateAccount: async (id, data) => {
        const response = await api.put(`/accounts/${id}`, data);
        return response.data;
    },
    deleteAccount: async (id) => {
        const response = await api.delete(`/accounts/${id}`);
        return response.data;
    }
};

export const planAPI = {
    getPlans: async () => {
        const response = await api.get('/plans');
        return response.data;
    },
    createPlan: async (data) => {
        const response = await api.post('/plans', data);
        return response.data;
    },
    updatePlan: async (id, data) => {
        const response = await api.put(`/plans/${id}`, data);
        return response.data;
    },
    contributeToPlan: async (id, data) => {
        const response = await api.post(`/plans/${id}/contribute`, data);
        return response.data;
    },
    deletePlan: async (id) => {
        const response = await api.delete(`/plans/${id}`);
        return response.data;
    }
};

export const supportAPI = {
    sendMessage: async (message) => {
        const response = await api.post('/support', { message });
        return response.data;
    }
};

export { API_URL };