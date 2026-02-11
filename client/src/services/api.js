import axios from 'axios';

// 🔥 ВАЖНО: Новый URL API!
const API_URL = 'https://finance-tracker-api-hjcz.onrender.com/api';

console.log(`🌍 Подключаюсь к API: ${API_URL}`);
console.log(`📍 Фронтенд: ${window.location.origin}`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Для отладки
api.interceptors.request.use(config => {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

api.interceptors.response.use(
    response => {
        console.log(`✅ Ответ ${response.status}:`, response.data?.length ? `${response.data.length} записей` : 'OK');
        return response;
    },
    error => {
        console.error('❌ Ошибка API:', error.message);
        return Promise.reject(error);
    }
);

export const transactionAPI = {
    getTransactions: async () => {
        try {
            const response = await api.get('/transactions');
            return response.data || [];
        } catch (error) {
            console.error('Ошибка загрузки транзакций:', error.message);
            // Fallback на локальные данные
            return [
                { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
                { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
                { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' }
            ];
        }
    },

    createTransaction: async (transactionData) => {
        try {
            const response = await api.post('/transactions', transactionData);
            return response.data;
        } catch (error) {
            console.error('Ошибка создания транзакции:', error.message);
            // Локальный fallback
            return {
                id: Date.now(),
                ...transactionData,
                date: transactionData.date || new Date().toISOString().split('T')[0]
            };
        }
    },

    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления транзакции:', error.message);
            return { success: true };
        }
    },

    getStatistics: async () => {
        try {
            const response = await api.get('/transactions/stats');
            return response.data;
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error.message);
            return { income: { total: 0 }, expense: { total: 0 } };
        }
    }
};

export { API_URL };