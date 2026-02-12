const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const authRoutes = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth'); // ✅ импорт middleware

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

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
app.options('*', cors());
app.use(express.json());

// ============================================
// ИНИЦИАЛИЗАЦИЯ БД (таблицы, индексы)
// ============================================
const initDatabase = async () => { /* ... без изменений ... */ };

// ============================================
// ПОДКЛЮЧЕНИЕ МАРШРУТОВ
// ============================================
app.use('/api/auth', authRoutes);

// ============================================
// ЗАЩИЩЁННЫЕ МАРШРУТЫ (ТРАНЗАКЦИИ)
// ============================================
// ✅ Используем импортированный authMiddleware
app.get('/api/transactions', authMiddleware, async (req, res) => {
    console.log('📡 GET /api/transactions (user:', req.user.id, ')');
    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, id DESC LIMIT 100',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/transactions', authMiddleware, async (req, res) => { /* ... */ });
app.delete('/api/transactions/:id', authMiddleware, async (req, res) => { /* ... */ });
app.get('/api/transactions/stats', authMiddleware, async (req, res) => { /* ... */ });

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'OK',
            message: 'Finance Tracker API с авторизацией работает',
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
(async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`✅ API запущен на порту ${PORT}`);
            console.log(`📡 Health: http://localhost:${PORT}/api/health`);
            console.log(`🔐 Auth: /api/auth (send-verification, register, login, me, change-password)`);
            console.log(`💰 Transactions: /api/transactions (защищено)`);
        });
    } catch (error) {
        console.error('❌ Не удалось запустить сервер:', error.message);
    }
})();