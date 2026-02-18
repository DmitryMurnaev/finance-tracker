const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Получить все планы пользователя
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM plans WHERE user_id = $1 ORDER BY id',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Ошибка получения планов:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создать новый план
router.post('/', authMiddleware, async (req, res) => {
    const { name, target_amount, icon_id = 1, color_id = 1, deadline } = req.body;
    if (!name || !target_amount) {
        return res.status(400).json({ error: 'Название и целевая сумма обязательны' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO plans (user_id, name, target_amount, icon_id, color_id, deadline)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.user.id, name, target_amount, icon_id, color_id, deadline]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка создания плана:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить план (например, изменить название, сумму, иконку)
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, target_amount, icon_id, color_id, deadline } = req.body;
    try {
        const result = await pool.query(
            `UPDATE plans
             SET name = $1, target_amount = $2, icon_id = $3, color_id = $4, deadline = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [name, target_amount, icon_id, color_id, deadline, id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'План не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка обновления плана:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Внести деньги в план (увеличить current_amount)
router.post('/:id/contribute', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { amount, account_id, description } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Сумма должна быть положительной' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Проверить существование плана
        const planRes = await client.query(
            'SELECT * FROM plans WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        if (planRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'План не найден' });
        }

        // Проверить достаточность средств на счёте
        const accountRes = await client.query(
            'SELECT balance FROM accounts WHERE id = $1 AND user_id = $2',
            [account_id, req.user.id]
        );
        if (accountRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Счёт не найден' });
        }
        const balance = parseFloat(accountRes.rows[0].balance);
        if (balance < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Недостаточно средств на счёте' });
        }

        // Уменьшить баланс счёта
        await client.query(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
            [amount, account_id]
        );

        // Увеличить current_amount плана
        await client.query(
            'UPDATE plans SET current_amount = current_amount + $1 WHERE id = $2',
            [amount, id]
        );

        // Создать транзакцию расхода (опционально)
        await client.query(
            `INSERT INTO transactions (amount, type, category_id, account_id, description, date, user_id)
             VALUES ($1, 'expense', NULL, $2, $3, CURRENT_DATE, $4)`,
            [amount, account_id, description || 'Пополнение плана', req.user.id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Средства внесены' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Ошибка внесения в план:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        client.release();
    }
});

// Удалить план
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM plans WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'План не найден' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Ошибка удаления плана:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;