// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await authAPI.getMe();
                setUser(userData);
            } catch {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await authAPI.login(email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    // Регистрация с валютой
    const register = async (email, password, name, preferredCurrency = 'RUB') => {
        const data = await authAPI.register(email, password, name, preferredCurrency);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const changePassword = async (oldPassword, newPassword) => {
        const data = await authAPI.changePassword(oldPassword, newPassword);
        return data;
    };

    // Метод для обновления валюты
    const updatePreferredCurrency = async (currency) => {
        const data = await authAPI.updatePreferredCurrency(currency);
        setUser(data.user);
        return data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            changePassword,
            updatePreferredCurrency
        }}>
            {children}
        </AuthContext.Provider>
    );
};