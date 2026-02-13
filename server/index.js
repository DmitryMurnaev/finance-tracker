const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const authRoutes = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Finance Tracker API с авторизацией запущен');

// Разрешенные домены
const allowedOrigins = [
    'https://finance-tracker-frontend-nxmx.onrender.com',
    'https://finance-tracker-frontend.onrender.com',
    'https://finance-tracker-frontend-dev-jjcg.onrender.com',
    'http://localhost:5173'
];

const categoriesRoutes = require('./routes/categories');

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT']
}));
app.options('*', cors());
app.use(express.json());


app.use('/api/categories', categoriesRoutes);


// ============================================
// ПОДКЛЮЧЕНИЕ МАРШРУТОВ АУТЕНТИФИКАЦИИ
// ============================================
app.use('/api/auth', authRoutes);

// ============================================
// ЗАЩИЩЁННЫЕ МАРШРУТЫ ДЛЯ ТРАНЗАКЦИЙ
// ============================================
// Получить все транзакции пользователя
app.get('/api/transactions', authMiddleware, async (req, res) => {
    console.log('📡 GET /api/transactions (user:', req.user.id, ')');
    try {
        const result = await pool.query(
            `SELECT t.*, 
                c.name as category_name
         FROM transactions t
         LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 
         ORDER BY t.date DESC, t.id DESC 
         LIMIT 100`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Ошибка GET:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ➕ Создать новую транзакцию
app.post('/api/transactions', authMiddleware, async (req, res) => {
    console.log('📝 POST /api/transactions (user:', req.user.id, ')', req.body);
    const { amount, type, category_id, description, date } = req.body;
    if (!amount || !type || !category_id) {
        return res.status(400).json({ error: 'Сумма, тип и категория обязательны' });
    }
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Тип должен быть income или expense' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date, user_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                amount,
                type,
                category,
                description,
                date || new Date().toISOString().split('T')[0],
                req.user.id
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Ошибка POST:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✏️ Обновить транзакцию
app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    console.log(`✏️ PUT /api/transactions/${id} (user: ${req.user.id})`, req.body);
    const { amount, type, category_id, description, date } = req.body;
    if (!amount || !type || !category_id) {
        return res.status(400).json({ error: 'Сумма, тип и категория обязательны' });
    }
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Тип должен быть income или expense' });
    }
    try {
        const result = await pool.query(
            `UPDATE transactions 
             SET amount = $1, type = $2, category_id = $3, description = $4, date = $5
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [
                amount,
                type,
                category_id,   // ✅ правильно
                description,
                date || new Date().toISOString().split('T')[0],
                id,
                req.user.id
            ]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена или не принадлежит вам' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Ошибка PUT:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 🗑️ Удалить транзакцию
app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    console.log(`🗑️ DELETE /api/transactions/${id} (user: ${req.user.id})`);
    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена или не принадлежит вам' });
        }
        res.json({ success: true, deleted: result.rows[0] });
    } catch (error) {
        console.error('❌ Ошибка DELETE:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 📊 Статистика пользователя
app.get('/api/transactions/stats', authMiddleware, async (req, res) => {
    console.log('📊 GET /api/transactions/stats (user:', req.user.id, ')');
    try {
        const incomeRes = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2',
            [req.user.id, 'income']
        );
        const expenseRes = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = $2',
            [req.user.id, 'expense']
        );
        const income = parseFloat(incomeRes.rows[0].total) || 0;
        const expense = parseFloat(expenseRes.rows[0].total) || 0;
        res.json({
            income: { total: income },
            expense: { total: expense },
            balance: income - expense
        });
    } catch (error) {
        console.error('❌ Ошибка STATS:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            message: 'Finance Tracker API работает',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Ошибка подключения к БД',
            error: error.message
        });
    }
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================
app.listen(PORT, () => {
    console.log(`✅ API запущен на порту ${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth: /api/auth (register, login, me, change-password)`);
    console.log(`💰 Transactions: /api/transactions (защищено)`);
});