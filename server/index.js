const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const authRoutes = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth');
const categoriesRoutes = require('./routes/categories');
const accountsRoutes = require('./routes/accounts')

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
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT']
}));
app.options('*', cors());
app.use(express.json());

const crypto = require('crypto');


const plansRoutes = require('./routes/plans');
const supportRoutes = require('./routes/support');

app.use('/api/plans', plansRoutes);
app.use('/api/support', supportRoutes);

app.use('/api/categories', categoriesRoutes);
app.use('/api/accounts', accountsRoutes)

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
       c.name as category_name,
       a.name as account_name,
       a.icon_id as account_icon_id,
       a.color_id as account_color_id
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN accounts a ON t.account_id = a.id
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
    const { amount, type, category_id, account_id, description, date } = req.body;
    if (!amount || !type || !category_id || !account_id) {
        return res.status(400).json({ error: 'Сумма, тип, категория и счёт обязательны' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Для расхода проверяем достаточность средств
        if (type === 'expense') {
            const accountRes = await client.query(
                'SELECT balance FROM accounts WHERE id = $1 AND user_id = $2',
                [account_id, req.user.id]
            );
            if (accountRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'Счёт не найден' });
            }
            const currentBalance = parseFloat(accountRes.rows[0].balance);
            if (currentBalance < amount) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: 'Недостаточно средств на счёте' });
            }
        }

        // Вставляем транзакцию
        const insertRes = await client.query(
            `INSERT INTO transactions (amount, type, category_id, account_id, description, date, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [amount, type, category_id, account_id, description, date || new Date().toISOString().split('T')[0], req.user.id]
        );

        // Обновляем баланс счёта
        const balanceChange = type === 'income' ? amount : -amount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
            [balanceChange, account_id, req.user.id]
        );

        await client.query('COMMIT');
        res.status(201).json(insertRes.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка POST:', error.message);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// ✏️ Обновить транзакцию
app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { amount, type, category_id, account_id, description, date } = req.body;
    if (!amount || !type || !category_id || !account_id) {
        return res.status(400).json({ error: 'Сумма, тип, категория и счёт обязательны' });
    }
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Тип должен быть income или expense' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Получаем старую транзакцию
        const oldRes = await client.query(
            'SELECT amount, type, account_id FROM transactions WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        if (oldRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Транзакция не найдена или не принадлежит вам' });
        }
        const old = oldRes.rows[0];

        // 2. Получаем текущий баланс счёта, с которым будем работать (новый счёт)
        const accountRes = await client.query(
            'SELECT balance FROM accounts WHERE id = $1 AND user_id = $2',
            [account_id, req.user.id]
        );
        if (accountRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Новый счёт не найден' });
        }
        const newAccountBalance = parseFloat(accountRes.rows[0].balance);

        // 3. Рассчитываем, как изменится баланс нового счёта после применения новой транзакции
        const newChange = type === 'income' ? amount : -amount;

        // 4. Если новый счёт совпадает со старым, нужно учесть отмену старой транзакции
        let finalNewBalance;
        if (account_id === old.account_id) {
            // Старый баланс после отмены старой транзакции: newAccountBalance (он уже содержит старую)
            // Отменяем старую: newAccountBalance - oldChange? Но проще вычислить итог:
            // Итоговый баланс = текущий баланс + oldChange (отмена) + newChange
            // oldChange = (old.type === 'income' ? -old.amount : old.amount) – как мы используем ниже
            const oldChange = old.type === 'income' ? -old.amount : old.amount;
            finalNewBalance = newAccountBalance + oldChange + newChange;
        } else {
            // Счета разные: старый счёт будет скорректирован позже, а новый должен выдержать newChange
            finalNewBalance = newAccountBalance + newChange;
        }

        // 5. Проверка отрицательного баланса (только если newChange отрицательное)
        if (newChange < 0 && finalNewBalance < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Недостаточно средств на счёте для выполнения операции' });
        }

        // 6. Обновляем транзакцию
        const updateRes = await client.query(
            `UPDATE transactions 
             SET amount = $1, type = $2, category_id = $3, account_id = $4, description = $5, date = $6
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [
                amount,
                type,
                category_id,
                account_id,
                description,
                date || new Date().toISOString().split('T')[0],
                id,
                req.user.id
            ]
        );

        // 7. Корректируем балансы счетов
        // Сначала отменяем влияние старой транзакции
        const oldChange = old.type === 'income' ? -old.amount : old.amount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
            [oldChange, old.account_id, req.user.id]
        );

        // Затем применяем влияние новой транзакции
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
            [newChange, account_id, req.user.id]
        );

        await client.query('COMMIT');
        console.log(`✅ Транзакция ${id} обновлена, балансы скорректированы`);
        res.json(updateRes.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка PUT:', error.message);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 🗑️ Удалить транзакцию
app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Получаем данные транзакции перед удалением
        const getRes = await client.query(
            'SELECT amount, type, account_id FROM transactions WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        if (getRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Транзакция не найдена или не принадлежит вам' });
        }
        const { amount, type, account_id } = getRes.rows[0];

        // Удаляем транзакцию
        await client.query(
            'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        // Корректируем баланс счета: для расхода возвращаем, для дохода вычитаем
        const balanceChange = type === 'expense' ? amount : -amount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
            [balanceChange, account_id, req.user.id]
        );

        await client.query('COMMIT');
        console.log(`✅ Транзакция ${id} удалена, баланс счета ${account_id} скорректирован`);
        res.json({ success: true, message: 'Транзакция удалена' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка DELETE:', error.message);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// 💸 Перевод между счетами
app.post('/api/transactions/transfer', authMiddleware, async (req, res) => {
    console.log('💰 Перевод, тело запроса:', req.body);
    const { fromAccountId, toAccountId, amount, description } = req.body;
    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Необходимо указать счета и сумму' });
    }
    if (fromAccountId === toAccountId) {
        return res.status(400).json({ error: 'Счета должны отличаться' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Проверяем баланс исходного счёта
        const fromRes = await client.query(
            'SELECT balance FROM accounts WHERE id = $1 AND user_id = $2',
            [fromAccountId, req.user.id]
        );
        if (fromRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Счёт списания не найден' });
        }
        const fromBalance = parseFloat(fromRes.rows[0].balance);
        if (fromBalance < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Недостаточно средств на счёте списания' });
        }

        // Проверяем существование целевого счёта
        const toRes = await client.query(
            'SELECT id FROM accounts WHERE id = $1 AND user_id = $2',
            [toAccountId, req.user.id]
        );
        if (toRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Счёт пополнения не найден' });
        }

        // Генерируем общий transfer_id
        const transferId = crypto.randomUUID();
        console.log('🆔 transferId:', transferId);

        // Описание по умолчанию
        const finalDescription = description?.trim() || 'Перевод между счетами';

        // Создаём расходную транзакцию
        await client.query(
            `INSERT INTO transactions (amount, type, account_id, description, date, user_id, transfer_id)
             VALUES ($1, 'expense', $2, $3, CURRENT_DATE, $4, $5)`,
            [amount, fromAccountId, finalDescription, req.user.id, transferId]
        );

        // Создаём доходную транзакцию
        await client.query(
            `INSERT INTO transactions (amount, type, account_id, description, date, user_id, transfer_id)
             VALUES ($1, 'income', $2, $3, CURRENT_DATE, $4, $5)`,
            [amount, toAccountId, finalDescription, req.user.id, transferId]
        );

        // Обновляем балансы счетов
        await client.query(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
            [amount, fromAccountId]
        );
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [amount, toAccountId]
        );

        await client.query('COMMIT');
        console.log('✅ Перевод выполнен');
        res.json({ success: true, message: 'Перевод выполнен' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка перевода:', error.message, error.stack);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
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