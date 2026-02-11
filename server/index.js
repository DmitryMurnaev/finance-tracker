const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Запуск Finance Tracker API для Render');
console.log('📡 Порт:', PORT);

// ВАЖНО: Правильный CORS - явно указываем фронтенд
const allowedOrigins = [
    'https://finance-tracker-frontend-nxmx.onrender.com',
    'https://finance-tracker-frontend.onrender.com',
    'http://localhost:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Разрешаем запросы без origin (Postman, curl) и из списка
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`❌ CORS заблокирован: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Обработка preflight запросов
app.options('*', cors(corsOptions));

app.use(express.json());

// Мок-данные
let transactions = [
    { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
    { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
    { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' },
    { id: 4, amount: 1200, type: 'expense', category: 'shopping', description: 'Покупка в магазине', date: '2024-02-10' },
    { id: 5, amount: 5000, type: 'income', category: 'freelance', description: 'Проект для клиента', date: '2024-02-10' }
];

// Маршруты API
app.get('/api/health', (req, res) => {
    console.log(`✅ Health check от: ${req.headers.origin || 'unknown'}`);
    res.json({
        status: 'OK',
        message: 'Finance Tracker API работает на Render',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        cors: 'enabled',
        data: 'mock (база данных временно недоступна)'
    });
});

app.get('/api/transactions', (req, res) => {
    console.log(`📡 GET /transactions от: ${req.headers.origin || 'unknown'}`);

    // Сортируем по дате (новые сверху)
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date) - new Date(a.date) || b.id - a.id
    );

    console.log(`✅ Отправляю ${sortedTransactions.length} транзакций`);
    res.json(sortedTransactions);
});

app.post('/api/transactions', (req, res) => {
    console.log(`📝 POST /transactions от: ${req.headers.origin || 'unknown'}`);
    console.log('📦 Данные:', req.body);

    const newTransaction = {
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
        ...req.body,
        date: req.body.date || new Date().toISOString().split('T')[0]
    };

    transactions.unshift(newTransaction);

    console.log(`✅ Транзакция добавлена. ID: ${newTransaction.id}`);
    res.status(201).json(newTransaction);
});

app.delete('/api/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`🗑️ DELETE /transactions/${id} от: ${req.headers.origin || 'unknown'}`);

    const initialLength = transactions.length;
    transactions = transactions.filter(t => t.id !== id);

    if (transactions.length === initialLength) {
        return res.status(404).json({
            error: 'Transaction not found',
            message: `Transaction with ID ${id} does not exist`
        });
    }

    console.log(`✅ Транзакция ${id} удалена`);
    res.json({
        success: true,
        message: `Transaction ${id} deleted successfully`,
        remaining: transactions.length
    });
});

app.get('/api/transactions/stats', (req, res) => {
    console.log(`📊 GET /stats от: ${req.headers.origin || 'unknown'}`);

    const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const stats = {
        income: { total: incomeTotal },
        expense: { total: expenseTotal }
    };

    console.log(`📈 Статистика: Доходы=${incomeTotal} руб., Расходы=${expenseTotal} руб.`);
    res.json(stats);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ API сервер запущен на порту ${PORT}`);
    console.log(`🌐 Доступен по адресу: https://finance-tracker-api.onrender.com`);
    console.log(`🏥 Health check: https://finance-tracker-api.onrender.com/api/health`);
    console.log(`📊 Transactions: https://finance-tracker-api.onrender.com/api/transactions`);
});