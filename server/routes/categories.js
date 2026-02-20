const express = require('express');
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Получить все категории (общие для всех пользователей)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Ошибка получения категорий:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создать категорию
router.post('/', authMiddleware, async (req, res) => {
    const { name, icon, color, type } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });
    try {
        const result = await pool.query(
            `INSERT INTO categories (user_id, name, icon, color, type)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.id, name, icon, color, type || 'both']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка создания категории:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновить категорию
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, icon, color, type } = req.body;
    try {
        const result = await pool.query(
            `UPDATE categories
             SET name = $1, icon = $2, color = $3, type = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 AND user_id = $6 RETURNING *`,
            [name, icon, color, type, id, req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Категория не найдена' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Ошибка обновления категории:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удалить категорию
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // Проверяем, есть ли привязанные транзакции
        const check = await pool.query('SELECT id FROM transactions WHERE category_id = $1 LIMIT 1', [id]);
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Нельзя удалить категорию с транзакциями' });
        }
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Категория не найдена' });
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Ошибка удаления категории:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;