require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
console.log('🔧 Настройка подключения к PostgreSQL...');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'finance_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ichigo21',
});

// Тестируем подключение при запуске
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
        return;
    }

    console.log('✅ Подключение к PostgreSQL установлено');

    client.query('SELECT COUNT(*) as count FROM transactions', (err, result) => {
        release();
        if (!err) {
            console.log(`📊 В таблице transactions: ${result.rows[0].count} записей`);
        }
    });
});

// Маршруты API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Finance Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// Получить все транзакции
app.get('/api/transactions', async (req, res) => {
    console.log('📡 GET /api/transactions - получение всех транзакций');
    try {
        // Сортируем по дате (последние сверху), потом по ID
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY date DESC, id DESC'
        );

        console.log(`📊 Найдено ${result.rows.length} транзакций`);

        // Форматируем данные для фронтенда
        const transactions = result.rows.map(transaction => ({
            ...transaction,
            // Преобразуем amount из строки в число
            amount: parseFloat(transaction.amount),
            // Форматируем дату
            date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : null
        }));

        res.json(transactions);

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
    console.log('📝 POST /api/transactions - добавление транзакции');
    console.log('📦 Данные:', req.body);

    try {
        const { amount, type, category, description, date } = req.body;

        // Используем структуру таблицы (без created_at)
        const result = await pool.query(
            `INSERT INTO transactions (amount, type, category, description, date) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                amount,
                type,
                category,
                description,
                date || new Date().toISOString().split('T')[0] // Если дата не указана, используем сегодня
            ]
        );

        const newTransaction = result.rows[0];
        // Преобразуем amount в число
        newTransaction.amount = parseFloat(newTransaction.amount);

        console.log(`✅ Транзакция добавлена. ID: ${newTransaction.id}`);
        res.status(201).json(newTransaction);

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
    console.log(`🗑️ DELETE /api/transactions/${id} - удаление транзакции`);

    try {
        const result = await pool.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            console.log(`⚠️ Транзакция ${id} не найдена`);
            return res.status(404).json({
                error: 'Transaction not found',
                message: `Transaction with ID ${id} does not exist`
            });
        }

        const deletedTransaction = result.rows[0];
        deletedTransaction.amount = parseFloat(deletedTransaction.amount);

        console.log(`✅ Транзакция ${id} удалена: ${deletedTransaction.type} ${deletedTransaction.amount} руб.`);
        res.json({
            success: true,
            message: `Transaction ${id} deleted successfully`,
            deleted: deletedTransaction
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
    console.log('📊 GET /api/transactions/stats - получение статистики');

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

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Transactions API: http://localhost:${PORT}/api/transactions`);
    console.log(`📈 Statistics API: http://localhost:${PORT}/api/transactions/stats`);
});