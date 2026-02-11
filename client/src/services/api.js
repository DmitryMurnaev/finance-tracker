require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Запуск Finance Tracker API');
console.log('📡 Порт:', PORT);

// ВАЖНО: Разрешаем все домены для тестирования
app.use(cors({
    origin: '*',  // Разрешаем все - потом можно будет ограничить
    credentials: true
}));

app.use(express.json());

// 1. ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ RENDER
console.log('🔗 Подключаюсь к PostgreSQL на Render...');

const pool = new Pool({
    connectionString: 'postgresql://finance_tracker_jm5c_user:dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x@dpg-d6626fmr433s73d8dcq0-a.oregon-postgres.render.com:5432/finance_tracker_jm5c',
    ssl: {
        rejectUnauthorized: false  // ВАЖНО для Render!
    }
});

// Проверяем подключение
pool.connect()
    .then(client => {
        console.log('✅ Подключение к PostgreSQL установлено!');

        // Проверяем таблицу
        return client.query('SELECT COUNT(*) FROM transactions')
            .then(result => {
                console.log(`📊 Записей в БД: ${result.rows[0].count}`);
                client.release();
            })
            .catch(err => {
                console.log('⚠️ Таблица transactions не найдена или ошибка:', err.message);
                client.release();
            });
    })
    .catch(err => {
        console.error('❌ Ошибка подключения к БД:', err.message);
    });

// 2. МАРШРУТЫ API

// Проверка здоровья
app.get('/api/health', (req, res) => {
    console.log(`🏥 Health check от: ${req.headers.origin || 'unknown'}`);
    res.json({
        status: 'OK',
        message: 'Finance Tracker API работает',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL на Render'
    });
});

// Получить все транзакции
app.get('/api/transactions', async (req, res) => {
    console.log(`📡 GET /transactions от: ${req.headers.origin || 'unknown'}`);

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

// Добавить транзакцию
app.post('/api/transactions', async (req, res) => {
    console.log(`📝 POST /transactions от: ${req.headers.origin || 'unknown'}`);
    console.log('📦 Данные:', req.body);

    try {
        const { amount, type, category, description, date } = req.body;

        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                amount,
                type,
                category,
                description,
                date || new Date().toISOString().split('T')[0]
            ]
        );

        console.log(`✅ Транзакция добавлена. ID: ${result.rows[0].id}`);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('❌ Ошибка при добавлении транзакции:', error.message);
        res.status(500).json({
            error: 'Database error',
            message: error.message
        });
    }
});

// Удалить транзакцию
app.delete('/api/transactions/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`🗑️ DELETE /transactions/${id} от: ${req.headers.origin || 'unknown'}`);

    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: 'Transaction not found',
                message: `Transaction with ID ${id} does not exist`
            });
        }

        console.log(`✅ Транзакция ${id} удалена`);
        res.json({
            success: true,
            message: `Transaction ${id} deleted successfully`,
            deleted: result.rows[0]
        });

    } catch (error) {
        console.error('❌ Ошибка при удалении транзакции:', error.message);
        res.status(500).json({
            error: 'Database error',
            message: error.message
        });
    }
});

// Получить статистику
app.get('/api/transactions/stats', async (req, res) => {
    console.log(`📊 GET /stats от: ${req.headers.origin || 'unknown'}`);

    try {
        const [incomeResult, expenseResult] = await Promise.all([
            pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'"),
            pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'")
        ]);

        const stats = {
            income: {
                total: parseFloat(incomeResult.rows[0].total) || 0
            },
            expense: {
                total: parseFloat(expenseResult.rows[0].total) || 0
            }
        };

        console.log(`📈 Статистика: Доходы=${stats.income.total} руб., Расходы=${stats.expense.total} руб.`);
        res.json(stats);

    } catch (error) {
        console.error('❌ Ошибка при получении статистики:', error.message);
        res.status(500).json({
            error: 'Database error',
            message: error.message
        });
    }
});

// 3. ЗАПУСК СЕРВЕРА
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Health check: https://finance-tracker-api.onrender.com/api/health`);
    console.log(`📊 Transactions: https://finance-tracker-api.onrender.com/api/transactions`);
    console.log(`📈 Statistics: https://finance-tracker-api.onrender.com/api/transactions/stats`);
});