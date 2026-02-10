import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const transactionAPI = {
    // Получить все транзакции
    getTransactions: async () => {
        try {
            const response = await api.get('/transactions');
            console.log('API Response:', response.data);

            // Проверяем разные форматы ответа
            if (Array.isArray(response.data)) {
                return response.data; // Если API возвращает массив напрямую
            } else if (response.data.data && Array.isArray(response.data.data)) {
                return response.data.data; // Если { data: [...] }
            } else if (response.data.success && Array.isArray(response.data.data)) {
                return response.data.data; // Если { success: true, data: [...] }
            } else {
                console.warn('Unexpected API response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    },

    // Создать транзакцию
    createTransaction: async (transaction) => {
        try {
            const response = await api.post('/transactions', transaction);
            return response.data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    },

    // Удалить транзакцию
    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    },

    // Получить статистику
    getStatistics: async () => {
        try {
            const response = await api.get('/transactions/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return { income: { total: 0 }, expense: { total: 0 } };
        }
    }
};

export default api;