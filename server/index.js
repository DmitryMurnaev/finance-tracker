const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Секретный ключ для JWT (обязательно задай в переменных окружения на Render!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

console.log('🚀 Finance Tracker API с авторизацией запущен');

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
app.options('*', cors());
app.use(express.json());

// Разрешенные домены
const allowedOrigins = [
    'https://finance-tracker-frontend-nxmx.onrender.com',
    'https://finance-tracker-frontend.onrender.com',
    'https://finance-tracker-frontend-dev-jjcg.onrender.com', // ✅ твой тестовый
    'http://localhost:5173'
];



// ============================================
// 1. ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
// ============================================
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

pool.on('connect', () => console.log('✅ Подключение к PostgreSQL установлено'));
pool.on('error', (err) => console.error('❌ Ошибка подключения к PostgreSQL:', err.message));

// ============================================
// 2. ИНИЦИАЛИЗАЦИЯ БД (таблицы, индексы)
// ============================================
const initDatabase = async () => {
    try {
        // Таблица пользователей
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Таблица users создана/проверена');

        // Добавляем user_id в transactions, если нет
        await pool.query(`
            ALTER TABLE transactions 
            ADD COLUMN IF NOT EXISTS user_id INTEGER 
            REFERENCES users(id) ON DELETE CASCADE;
        `);
        console.log('✅ Поле user_id добавлено в transactions');

        // Индекс для быстрого поиска по пользователю
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_transactions_user_id 
            ON transactions(user_id);
        `);
        console.log('✅ Индекс idx_transactions_user_id создан');

        // Таблица транзакций (если её ещё нет — создадим)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                amount DECIMAL(10,2) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
                category VARCHAR(50) NOT NULL,
                description TEXT,
                date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log('✅ Таблица transactions создана/проверена');

        // Индексы для транзакций
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);`);

        // Тестовые данные — только если таблица пуста (без user_id, их добавит первый пользователь)
        const countRes = await pool.query('SELECT COUNT(*) FROM transactions');
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO transactions (amount, type, category, description, date) VALUES
                (500.00, 'expense', 'Еда', 'Обед в кафе', CURRENT_DATE),
                (250.00, 'expense', 'Транспорт', 'Такси на работу', CURRENT_DATE),
                (30000.00, 'income', 'Зарплата', 'Зарплата за январь', CURRENT_DATE),
                (1200.00, 'expense', 'Шоппинг', 'Покупка в магазине', CURRENT_DATE),
                (5000.00, 'income', 'Фриланс', 'Проект для клиента', CURRENT_DATE)
            `);
            console.log('✅ Тестовые транзакции добавлены (без user_id)');
        }

    } catch (error) {
        console.error('❌ Ошибка инициализации БД:', error.message);
    }
};

// ============================================
// 3. МИДЛВАРЫ
// ============================================
// Проверка JWT токена
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Недействительный токен' });
    }
};

// ============================================
// 4. ПУБЛИЧНЫЕ МАРШРУТЫ (АУТЕНТИФИКАЦИЯ)
// ============================================
// Регистрация
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    try {
        // Проверка существования пользователя
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Пользователь уже существует' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, passwordHash, name || null]
        );
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Привязываем старые тестовые транзакции к новому пользователю (если они есть без user_id)
        await pool.query('UPDATE transactions SET user_id = $1 WHERE user_id IS NULL', [user.id]);

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error.message);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

app.use('/api/auth', authRoutes);
// Вход
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
            token
        });
    } catch (error) {
        console.error('❌ Ошибка входа:', error.message);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// Получить данные текущего пользователя
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Ошибка получения пользователя:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ============================================
// 5. ЗАЩИЩЁННЫЕ МАРШРУТЫ (ТРАНЗАКЦИИ)
// ============================================
// Получить все транзакции пользователя
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

// Добавить транзакцию
app.post('/api/transactions', authMiddleware, async (req, res) => {
    console.log('📝 POST /api/transactions (user:', req.user.id, ')', req.body);
    const { amount, type, category, description, date } = req.body;
    if (!amount || !type || !category) {
        return res.status(400).json({ error: 'Сумма, тип и категория обязательны' });
    }
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Тип должен быть income или expense' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date, user_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [amount, type, category, description, date || new Date().toISOString().split('T')[0], req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Удалить транзакцию
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
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Смена пароля (защищённый маршрут)
app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    try {
        // Получаем пользователя из БД
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const user = userResult.rows[0];

        // Проверяем старый пароль
        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        // Хэшируем новый пароль
        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

        res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (error) {
        console.error('❌ Ошибка смены пароля:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Статистика пользователя
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
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 6. HEALTH CHECK (публичный)
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
// 7. ЗАПУСК СЕРВЕРА
// ============================================
(async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`✅ API запущен на порту ${PORT}`);
            console.log(`📡 Health: http://localhost:${PORT}/api/health`);
            console.log(`🔐 Auth: /api/auth (register, login, me)`);
            console.log(`💰 Transactions: /api/transactions (защищено)`);
        });
    } catch (error) {
        console.error('❌ Не удалось запустить сервер:', error.message);
    }
})();