const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Finance Tracker API (Production)');

// CORS для продакшена
const allowedOrigins = [
    'https://finance-tracker-frontend-nxmx.onrender.com',
    'https://finance-tracker-frontend.onrender.com',
    'http://localhost:5173'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));

app.options('*', cors());

app.use(express.json());

// Мок-данные для начала
let transactions = [
    { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
    { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
    { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' }
];

// Маршруты
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API работает',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/transactions', (req, res) => {
    res.json(transactions.sort((a, b) => b.id - a.id));
});

app.post('/api/transactions', (req, res) => {
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    const newTransaction = {
        id: newId,
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0]
    };

    transactions.unshift(newTransaction);
    res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = transactions.length;
    transactions = transactions.filter(t => t.id !== id);

    if (transactions.length === initialLength) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`✅ API запущен на порту ${PORT}`);
});