import axios from 'axios';

// Автоматически определяем окружение
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction
    ? 'https://finance-tracker-api.onrender.com/api'  // Будет ваш URL
    : 'http://localhost:5000/api';

console.log(`🌍 API URL: ${API_URL} (${isProduction ? 'production' : 'development'})`);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const transactionAPI = {
    getTransactions: async () => {
        try {
            const response = await api.get('/transactions');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    },

    createTransaction: async (transactionData) => {
        try {
            const response = await api.post('/transactions', transactionData);
            return response.data;
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    },

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