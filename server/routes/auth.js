const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Смена пароля
router.post('/change-password', authMiddleware, async (req, res) => {
    console.log('📥 Change password request for user:', req.user.id); // ← лог для проверки

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }

    try {
        // 1. Получаем пользователя из БД
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const user = userResult.rows[0];

        // 2. Проверяем старый пароль
        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Неверный текущий пароль' });
        }

        // 3. Хэшируем новый пароль
        const saltRounds = 10;
        const newHash = await bcrypt.hash(newPassword, saltRounds);

        // 4. Обновляем в БД
        const updateResult = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
            [newHash, req.user.id]
        );

        console.log('✅ Password updated, rows affected:', updateResult.rowCount); // ← важно!

        if (updateResult.rowCount === 0) {
            return res.status(500).json({ error: 'Не удалось обновить пароль' });
        }

        res.json({ success: true, message: 'Пароль успешно изменён' });

    } catch (error) {
        console.error('❌ Change password error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({ error: 'Ошибка при смене пароля' });
    }
});

// Регистрация
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    try {
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
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
        res.status(201).json({ user, token });
    } catch (err) {
        console.error('❌ Register error:', err.message);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// Вход
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
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
            token
        });
    } catch (err) {
        console.error('❌ Login error:', err.message);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// Получение текущего пользователя (по токену)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Me error:', err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


module.exports = router;