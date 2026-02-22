import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const { user } = useAuth();
    const [rates, setRates] = useState({}); // пустой объект – безопасно
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchRates = async () => {
        try {
            const response = await fetch('https://api.exchangerate.host/latest?base=RUB');
            const data = await response.json();
            console.log('📥 Полный ответ API:', data);

            const ratesData = data.rates || data.conversion_rates;
            if (ratesData) {
                setRates(ratesData);
                setLastUpdated(Date.now());
                localStorage.setItem('currencyRates', JSON.stringify({ rates: ratesData, timestamp: Date.now() }));
            } else {
                throw new Error('Rates not found in response');
            }
        } catch (error) {
            console.error('Failed to fetch currency rates', error);
            const cached = localStorage.getItem('currencyRates');
            if (cached) {
                try {
                    const { rates, timestamp } = JSON.parse(cached);
                    if (rates && typeof rates === 'object') {
                        setRates(rates);
                        setLastUpdated(timestamp);
                    } else {
                        throw new Error('Invalid cached rates');
                    }
                } catch {
                    // кеш битый – ставим fallback
                    setRates({ USD: 0.012, EUR: 0.011 });
                }
            } else {
                // fallback – примерные курсы
                setRates({ USD: 0.012, EUR: 0.011 });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cached = localStorage.getItem('currencyRates');
        if (cached) {
            try {
                const { rates, timestamp } = JSON.parse(cached);
                if (rates && typeof rates === 'object' && Date.now() - timestamp < 3600000) {
                    setRates(rates);
                    setLastUpdated(timestamp);
                    setLoading(false);
                    return;
                }
            } catch {
                // игнорируем битый кеш
            }
        }
        fetchRates();
        const interval = setInterval(fetchRates, 600000);
        return () => clearInterval(interval);
    }, []);

    // Полная защита: если rates не объект или не содержит нужного ключа – возвращаем сумму без конвертации
    const convert = (amountInRub, targetCurrency) => {
        if (targetCurrency === 'RUB') return amountInRub;
        if (!rates || typeof rates !== 'object') {
            console.warn('⚠️ rates is not an object, returning RUB');
            return amountInRub;
        }
        const rate = rates[targetCurrency];
        if (!rate) {
            console.warn(`Rate for ${targetCurrency} not found, using RUB`);
            return amountInRub;
        }
        return amountInRub * rate;
    };

    const formatCurrency = (amountInRub, currency = user?.preferred_currency || 'RUB') => {
        // Если rates ещё не загружены (пустой объект) – показываем в рублях
        if (!rates || Object.keys(rates).length === 0) {
            return amountInRub.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' RUB';
        }
        const converted = convert(amountInRub, currency);
        return converted.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
    };

    return (
        <CurrencyContext.Provider value={{ rates, loading, convert, formatCurrency, refreshRates: fetchRates }}>
            {children}
        </CurrencyContext.Provider>
    );
};