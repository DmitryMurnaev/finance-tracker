const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Finance Tracker API запущен');

// Разрешенные домены
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

// Подключение к PostgreSQL
const pool = new Pool({
    host: 'dpg-d6626fmr433s73d8dcq0-a',
    port: 5432,
    database: 'finance_tracker_jm5c',
    user: 'finance_tracker_jm5c_user',
    password: 'dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x',
    ssl: {
        rejectUnauthorized: false
    }
});

// Проверка подключения к БД
pool.on('connect', () => {
    console.log('Подключение к PostgreSQL установлено');
});

pool.on('error', (err) => {
    console.error('Ошибка подключения к PostgreSQL:', err.message);
});

// Создание таблицы если она не существует
const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                amount DECIMAL(10,2) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
                category VARCHAR(50) NOT NULL,
                description TEXT,
                date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Индексы для быстрого поиска
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
            CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
        `);

        console.log('Таблица transactions создана');

        // Проверяем есть ли данные
        const countResult = await pool.query('SELECT COUNT(*) FROM transactions');
        if (parseInt(countResult.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO transactions (amount, type, category, description) VALUES
                (500.00, 'expense', 'Еда', 'Обед в кафе'),
                (250.00, 'expense', 'Транспорт', 'Такси на работу'),
                (30000.00, 'income', 'Зарплата', 'Зарплата за январь'),
                (1200.00, 'expense', 'Шоппинг', 'Покупка в магазине'),
                (5000.00, 'income', 'Фриланс', 'Проект для клиента')
            `);
            console.log('Тестовые данные добавлены');
        }
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error.message);
    }
};

// Маршруты
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            message: 'API работает с PostgreSQL',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Ошибка подключения к базе данных',
            error: error.message
        });
    }
});

// Получить все транзакции
app.get('/api/transactions', async (req, res) => {
    console.log('GET /api/transactions');
    try {
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 100'
        );
        console.log(`Найдено ${result.rows.length} транзакций`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Добавить транзакцию
app.post('/api/transactions', async (req, res) => {
    console.log('POST /api/transactions:', req.body);
    try {
        const { amount, type, category, description, date } = req.body;

        // Проверка данных
        if (!amount || !type || !category) {
            return res.status(400).json({ error: 'Сумма, тип и категория обязательны' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Тип должен быть income или expense' });
        }

        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [amount, type, category, description, date || new Date().toISOString().split('T')[0]]
        );

        console.log('Транзакция добавлена, ID:', result.rows[0].id);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Удалить транзакцию
app.delete('/api/transactions/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`DELETE /api/transactions/${id}`);

    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        console.log('Транзакция удалена:', result.rows[0]);
        res.json({ success: true, deleted: result.rows[0] });
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Статистика
app.get('/api/transactions/stats', async (req, res) => {
    console.log('GET /api/transactions/stats');
    try {
        const incomeResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'"
        );
        const expenseResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'"
        );

        const income = parseFloat(incomeResult.rows[0].total) || 0;
        const expense = parseFloat(expenseResult.rows[0].total) || 0;
        const balance = income - expense;

        res.json({
            income: { total: income },
            expense: { total: expense },
            balance: balance
        });
    } catch (error) {
        console.error('Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
(async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`API запущен на порту ${PORT}`);
            console.log(`Проверка здоровья: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Не удалось запустить сервер:', error.message);
    }
})();