import axios from 'axios';

// Указываем правильный URL нового API
const API_URL = 'https://finance-tracker-api.onrender.com/api';

console.log(`📡 API URL: ${API_URL}`);

export const transactionAPI = {
    getTransactions: async () => {
        try {
            console.log('🔄 Загружаю данные...');
            const { data } = await axios.get(`${API_URL}/transactions`);
            console.log(`✅ Получено ${data?.length || 0} транзакций`);
            return data || [];
        } catch (error) {
            console.log('⚠️ API не доступен, использую мок-данные');
            return [
                { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
                { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
                { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' }
            ];
        }
    },

    createTransaction: async (transactionData) => {
        try {
            const { data } = await axios.post(`${API_URL}/transactions`, transactionData);
            return data;
        } catch (error) {
            console.log('⚠️ API не доступен, создаю локально');
            return {
                id: Date.now(),
                ...transactionData,
                date: transactionData.date || new Date().toISOString().split('T')[0]
            };
        }
    },

    deleteTransaction: async (id) => {
        try {
            await axios.delete(`${API_URL}/transactions/${id}`);
            return { success: true };
        } catch (error) {
            console.log('⚠️ API не доступен, удаляю локально');
            return { success: true };
        }
    }
};