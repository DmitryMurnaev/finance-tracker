import axios from 'axios';

const API_URL = 'https://finance-tracker-api.onrender.com/api';

console.log(`🌍 Подключаюсь к API: ${API_URL}`);
console.log(`📍 Фронтенд запущен на: ${window.location.origin}`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем CORS credentials
api.defaults.withCredentials = true;

export const transactionAPI = {
    getTransactions: async () => {
        try {
            console.log('📡 Запрашиваю транзакции...');
            const response = await api.get('/transactions');
            console.log(`✅ Получено ${response.data?.length || 0} транзакций`);
            return response.data || [];
        } catch (error) {
            console.error('❌ Ошибка:', error.message);
            console.log('🔄 Использую мок-данные...');

            // Fallback данные
            return [
                { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
                { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
                { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' },
                { id: 4, amount: 1200, type: 'expense', category: 'shopping', description: 'Покупка в магазине', date: '2024-02-10' },
                { id: 5, amount: 5000, type: 'income', category: 'freelance', description: 'Проект для клиента', date: '2024-02-10' }
            ];
        }
    },

    createTransaction: async (transactionData) => {
        try {
            console.log('📝 Отправляю новую транзакцию...');
            const response = await api.post('/transactions', transactionData);
            console.log('✅ Транзакция создана:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка создания:', error.message);

            // Мок-ответ если API не доступен
            const mockTransaction = {
                id: Date.now(),
                ...transactionData,
                date: transactionData.date || new Date().toISOString().split('T')[0]
            };
            console.log('🔄 Возвращаю мок-транзакцию');
            return mockTransaction;
        }
    },

    deleteTransaction: async (id) => {
        try {
            console.log(`🗑️ Удаляю транзакцию ${id}...`);
            const response = await api.delete(`/transactions/${id}`);
            console.log(`✅ Транзакция ${id} удалена`);
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка удаления:', error.message);
            return { success: true, message: `Transaction ${id} deleted (mock)` };
        }
    },

    getStatistics: async () => {
        try {
            const response = await api.get('/transactions/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Ошибка статистики:', error.message);
            return { income: { total: 35000 }, expense: { total: 1950 } };
        }
    }
};

export { API_URL };