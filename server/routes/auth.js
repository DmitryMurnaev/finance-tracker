const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// ============================================
// РЕГИСТРАЦИЯ (без подтверждения)
// ============================================
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Пользователь уже существует' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const userResult = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, passwordHash, name || null]
        );
        const user = userResult.rows[0];


        const token = jwt.sign(
            { userId: user.id, email: user.email },   // добавили email
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        await pool.query('UPDATE transactions SET user_id = $1 WHERE user_id IS NULL', [user.id]);

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error.message);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// ============================================
// ВХОД
// ============================================
router.post('/login', async (req, res) => {
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
        const token = jwt.sign(
            { userId: user.id, email: user.email },   // добавили email
            JWT_SECRET,
            { expiresIn: '7d' }
        );
    } catch (error) {
        console.error('❌ Ошибка входа:', error.message);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// ============================================
// ПОЛУЧЕНИЕ ПРОФИЛЯ
// ============================================п


router.get('/me', authMiddleware, async (req, res) => {
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
// СМЕНА ПАРОЛЯ
// ============================================
router.post('/change-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const user = userResult.rows[0];
        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }
        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);
        res.json({ success: true, message: 'Пароль успешно изменён' });
    } catch (error) {
        console.error('❌ Ошибка смены пароля:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;