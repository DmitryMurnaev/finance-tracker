const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Получить все счета пользователя
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM accounts WHERE user_id = $1 ORDER BY id',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Ошибка получения счетов:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создать новый счёт
router.post('/', authMiddleware, async (req, res) => {
    const { name, balance = 0, currency = 'RUB', icon_id = 1, color_id = 1 } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });
    try {
        const result = await pool.query(
            `INSERT INTO accounts (user_id, name, balance, currency, icon_id, color_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [req.user.id, name, balance, currency, icon_id, color_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка создания счета:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить счёт
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, icon_id, color_id, is_active } = req.body;
    try {
        const result = await pool.query(
            `UPDATE accounts
             SET name = $1, icon_id = $2, color_id = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 AND user_id = $6 RETURNING *`,
            [name, icon_id, color_id, is_active, id, req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Счёт не найден' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка обновления счета:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить счёт (только если нет транзакций)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // Проверяем, есть ли транзакции с этим счётом
        const check = await pool.query('SELECT id FROM transactions WHERE account_id = $1 LIMIT 1', [id]);
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Нельзя удалить счёт с транзакциями' });
        }
        const result = await pool.query(
            'DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Счёт не найден' });
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Ошибка удаления счета:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;