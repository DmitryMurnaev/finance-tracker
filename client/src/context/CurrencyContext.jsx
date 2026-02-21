import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const { user } = useAuth();
    const [rates, setRates] = useState({ USD: 1, EUR: 1 });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchRates = async () => {
        try {
            const response = await fetch('https://api.exchangerate.host/latest?base=RUB');
            const data = await response.json();
            if (data.rates) {
                setRates(data.rates);
                setLastUpdated(Date.now());
                localStorage.setItem('currencyRates', JSON.stringify({ rates: data.rates, timestamp: Date.now() }));
            }
        } catch (error) {
            console.error('Failed to fetch currency rates', error);
            const cached = localStorage.getItem('currencyRates');
            if (cached) {
                const { rates, timestamp } = JSON.parse(cached);
                setRates(rates);
                setLastUpdated(timestamp);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem('currencyRates');
        if (cached) {
            const { rates, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 3600000) { // 1 час
                setRates(rates);
                setLastUpdated(timestamp);
                setLoading(false);
                return;
            }
        }
        fetchRates();
        const interval = setInterval(fetchRates, 600000); // обновлять каждые 10 мин
        return () => clearInterval(interval);
    }, []);

    const convert = (amountInRub, targetCurrency) => {
        if (targetCurrency === 'RUB') return amountInRub;
        const rate = rates[targetCurrency];
        return rate ? amountInRub * rate : amountInRub;
    };

    const formatCurrency = (amountInRub, currency = user?.preferred_currency || 'RUB') => {
        const converted = convert(amountInRub, currency);
        return converted.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
    };

    return (
        <CurrencyContext.Provider value={{ rates, loading, convert, formatCurrency, refreshRates: fetchRates }}>
            {children}
        </CurrencyContext.Provider>
    );
};