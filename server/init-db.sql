-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
                                            id SERIAL PRIMARY KEY,
                                            amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Тестовые данные (опционально)
INSERT INTO transactions (amount, type, category, description) VALUES
                                                                   (500.00, 'expense', 'food', 'Обед в кафе'),
                                                                   (250.00, 'expense', 'transport', 'Такси на работу'),
                                                                   (30000.00, 'income', 'salary', 'Зарплата за январь'),
                                                                   (1200.00, 'expense', 'shopping', 'Покупка в магазине'),
                                                                   (5000.00, 'income', 'freelance', 'Проект для клиента')
    ON CONFLICT DO NOTHING;
EOF

# 2. Обновляем сервер для работы с Render PostgreSQL
cat > server/index.js << 'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Настройка подключения к PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d6626fmr433s73d8dcq0-a.oregon-postgres.render.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'finance_tracker_jm5c',
    user: process.env.DB_USER || 'finance_tracker_jm5c_user',
    password: process.env.DB_PASSWORD || 'dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x',
    ssl: {
        rejectUnauthorized: false
    }
});
// Логирование подключения
pool.on('connect', () => {
    console.log('✅ Подключение к PostgreSQL установлено');
    console.log('📍 Режим:', process.env.NODE_ENV || 'development');
});

pool.on('error', (err) => {
    console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
});

// Маршруты API
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            message: 'Finance Tracker API is running',
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Получить все транзакции
app.get('/api/transactions', async (req, res) => {
    console.log('📡 GET /api/transactions');
    try {
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 100'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Добавить транзакцию
app.post('/api/transactions', async (req, res) => {
    console.log('📝 POST /api/transactions:', req.body);
    try {
        const { amount, type, category, description, date } = req.body;

        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [amount, type, category, description, date || new Date().toISOString().split('T')[0]]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Удалить транзакцию
app.delete('/api/transactions/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`🗑️ DELETE /api/transactions/${id}`);

    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ success: true, deleted: result.rows[0] });
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Статистика
app.get('/api/transactions/stats', async (req, res) => {
    console.log('📊 GET /api/transactions/stats');
    try {
        const incomeResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'"
        );
        const expenseResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'"
        );

        res.json({
            income: { total: parseFloat(incomeResult.rows[0].total) },
            expense: { total: parseFloat(expenseResult.rows[0].total) }
        });
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📡 Health check: /api/health`);
    console.log(`📊 Transactions API: /api/transactions`);
});