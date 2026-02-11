import axios from 'axios';

const API_URL = 'https://finance-tracker-api-hjcz.onrender.com/api/auth';

const authAPI = {
    register: async (email, password, name) => {
        const response = await axios.post(`${API_URL}/register`, { email, password, name });
        return response.data;
    },
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    },
    getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export { authAPI };