require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Запуск Finance Tracker API');
console.log('📡 Порт:', PORT);

// ВАЖНО: CORS для фронтенда на Render
app.use(cors({
    origin: [
        'https://finance-tracker-frontend-nxmx.onrender.com',
        'https://finance-tracker-frontend.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());

// 1. ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ RENDER
console.log('🔗 Подключаюсь к PostgreSQL на Render...');

let pool;

try {
    // ОБРАТИТЕ ВНИМАНИЕ: правильный connection string
    const connectionString = 'postgresql://finance_tracker_jm5c_user:dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x@dpg-d6626fmr433s73d8dcq0-a.oregon-postgres.render.com:5432/finance_tracker_jm5c';

    pool = new Pool({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        },
        // Настройки для бесплатного тарифа
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    });

    console.log('✅ Пул подключений создан');
} catch (error) {
    console.error('❌ Ошибка создания пула БД:', error.message);
    console.log('⚠️ Буду использовать мок-данные');
}

// 2. Проверка подключения (асинхронно)
async function checkDatabase() {
    if (!pool) return false;

    try {
        const client = await pool.connect();
        console.log('✅ Подключение к PostgreSQL установлено!');

        // Проверяем/создаем таблицу
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                amount DECIMAL(10,2) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
                category VARCHAR(50) NOT NULL,
                description TEXT,
                date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const result = await client.query('SELECT COUNT(*) FROM transactions');
        console.log(`📊 Записей в БД: ${result.rows[0].count}`);

        client.release();
        return true;
    } catch (error) {
        console.error('❌ Ошибка подключения к БД:', error.message);
        return false;
    }
}

// Запускаем проверку (но не блокируем старт сервера)
checkDatabase().then(success => {
    if (success) {
        console.log('✅ База данных готова к работе');
    } else {
        console.log('⚠️ База данных недоступна, API будет использовать мок-данные');
    }
});

// 3. МАРШРУТЫ API

app.get('/api/health', (req, res) => {
    console.log(`🏥 Health check от: ${req.headers.origin || 'unknown'}`);
    res.json({
        status: 'OK',
        message: 'Finance Tracker API работает',
        timestamp: new Date().toISOString(),
        database: pool ? 'configured' : 'mock'
    });
});

// Получить все транзакции
app.get('/api/transactions', async (req, res) => {
    console.log(`📡 GET /transactions от: ${req.headers.origin || 'unknown'}`);

    // Если БД не доступна, возвращаем мок-данные
    if (!pool) {
        console.log('🔄 Возвращаю мок-данные (БД недоступна)');
        return res.json([
            { id: 1, amount: 500, type: 'expense', category: 'food', description: 'Обед в кафе', date: '2024-02-10' },
            { id: 2, amount: 250, type: 'expense', category: 'transport', description: 'Такси на работу', date: '2024-02-10' },
            { id: 3, amount: 30000, type: 'income', category: 'salary', description: 'Зарплата за январь', date: '2024-02-10' }
        ]);
    }

    try {
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY date DESC, id DESC'
        );
        console.log(`✅ Отправляю ${result.rows.length} транзакций`);
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Ошибка при получении транзакций:', error.message);
        res.status(500).json({
            error: 'Database error',
            message: error.message
        });
    }
});

// [Остальные маршруты остаются как были...]

// 4. ЗАПУСК СЕРВЕРА
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Health check: https://finance-tracker-api.onrender.com/api/health`);
});