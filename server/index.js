require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - УЛУЧШЕННЫЙ CORS
app.use(cors({
    origin: [
        'https://finance-tracker-frontend-nxmx.onrender.com',
        'https://finance-tracker-frontend.onrender.com',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Подключение к PostgreSQL для RENDER
console.log('🔧 Настройка подключения к PostgreSQL Render...');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // ВАЖНО! Используем connectionString
    ssl: {
        rejectUnauthorized: false  // ВАЖНО для Render
    }
});

// Тестируем подключение при запуске
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
        console.error('Проверьте DATABASE_URL:', process.env.DATABASE_URL);
        return;
    }

    console.log('✅ Подключение к PostgreSQL установлено');

    client.query('SELECT COUNT(*) as count FROM transactions', (err, result) => {
        release();
        if (!err) {
            console.log(`📊 В таблице transactions: ${result.rows[0].count} записей`);
        } else {
            console.error('❌ Ошибка при запросе к таблице:', err.message);
        }
    });
});

// Маршруты API (остальное оставляем как есть)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Finance Tracker API is running',
        timestamp: new Date().toISOString(),
        database: process.env.DATABASE_URL ? 'configured' : 'not configured'
    });
});

// ... остальные маршруты без изменений ...

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📡 Health check: https://finance-tracker-api.onrender.com/api/health`);
    console.log(`📊 Transactions API: https://finance-tracker-api.onrender.com/api/transactions`);
});