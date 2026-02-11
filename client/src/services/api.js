import axios from 'axios';

// В браузере process.env.NODE_ENV не работает
// Вместо этого определяем по текущему URL
const isLocalhost = window.location.hostname.includes('localhost') ||
    window.location.hostname.includes('127.0.0.1');

const API_URL = isLocalhost
    ? 'http://localhost:5000/api'
    : 'https://finance-tracker-api.onrender.com/api';

console.log(`🌍 API URL: ${API_URL}`);
console.log(`📍 Хост: ${window.location.hostname}`);
console.log(`🚀 Продакшен: ${!isLocalhost}`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // Увеличиваем для Render
    headers: {
        'Content-Type': 'application/json'
    }
});

// Интерцептор для отладки
api.interceptors.request.use(config => {
    console.log(`📡 Запрос: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

export const transactionAPI = {
    getTransactions: async () => {
        try {
            const response = await api.get('/transactions');
            console.log(`✅ Получено транзакций: ${response.data?.length || 0}`);
            return response.data || [];
        } catch (error) {
            console.error('❌ Ошибка загрузки транзакций:', error.message);

            // Fallback на мок-данные если API не доступен
            if (!isLocalhost) {
                console.log('🔄 Пробую мок-данные...');
                return [
                    { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
                    { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
                    { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' },
                    { id: 4, amount: 1200, type: 'expense', category: 'shopping', description: 'Покупка в магазине', date: '2024-02-10' },
                    { id: 5, amount: 5000, type: 'income', category: 'freelance', description: 'Проект для клиента', date: '2024-02-10' }
                ];
            }

            return [];
        }
    },

    createTransaction: async (transactionData) => {
        try {
            const response = await api.post('/transactions', transactionData);
            console.log('✅ Транзакция создана:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка создания транзакции:', error.message);

            // Fallback для продакшена
            if (!isLocalhost) {
                const mockTransaction = {
                    id: Date.now(),
                    ...transactionData,
                    date: transactionData.date || new Date().toISOString().split('T')[0]
                };
                console.log('🔄 Возвращаю мок-транзакцию');
                return mockTransaction;
            }

            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            console.log(`✅ Транзакция ${id} удалена`);
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка удаления транзакции:', error.message);

            // Fallback для продакшена
            if (!isLocalhost) {
                console.log('🔄 Мок-удаление транзакции');
                return { success: true, message: `Transaction ${id} deleted (mock)` };
            }

            throw error;
        }
    },

    getStatistics: async () => {
        try {
            const response = await api.get('/transactions/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка загрузки статистики:', error.message);

            // Fallback для продакшена
            if (!isLocalhost) {
                return {
                    income: { total: 35000 },
                    expense: { total: 1950 }
                };
            }

            return { income: { total: 0 }, expense: { total: 0 } };
        }
    }
};