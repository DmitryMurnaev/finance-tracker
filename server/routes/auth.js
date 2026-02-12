const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth'); // ✅ импорт секрета
const { generateCode, sendVerificationCode } = require('../utils/email');

const router = express.Router();

// ============================================
// ОТПРАВКА КОДА ПОДТВЕРЖДЕНИЯ
// ============================================
router.post('/send-verification', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email обязателен' });
    }
    try {
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Пользователь уже существует' });
        }
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
        await pool.query(
            'INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, $3)',
            [email, code, expiresAt]
        );
        await sendVerificationCode(email, code);
        res.json({ success: true, message: 'Код отправлен на почту' });
    } catch (error) {
        console.error('❌ Ошибка отправки кода:', error.message);
        res.status(500).json({ error: 'Не удалось отправить код' });
    }
});

// ============================================
// РЕГИСТРАЦИЯ С ПОДТВЕРЖДЕНИЕМ КОДА
// ============================================
router.post('/register', async (req, res) => {
    const { email, password, name, code } = req.body;
    if (!email || !password || !code) {
        return res.status(400).json({ error: 'Email, пароль и код обязательны' });
    }
    try {
        const codeResult = await pool.query(
            'SELECT * FROM verification_codes WHERE email = $1 AND code = $2 AND is_verified = FALSE AND expires_at > NOW()',
            [email, code]
        );
        if (codeResult.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный или истёкший код' });
        }
        await pool.query(
            'UPDATE verification_codes SET is_verified = TRUE WHERE id = $1',
            [codeResult.rows[0].id]
        );
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
        // ✅ используем единый JWT_SECRET
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        await pool.query('UPDATE transactions SET user_id = $1 WHERE user_id IS NULL', [user.id]);
        await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
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
        // ✅ используем единый JWT_SECRET
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: { id: user.id, email: user.email, name: user.name, created_at: user.created_at },
            token
        });
    } catch (error) {
        console.error('❌ Ошибка входа:', error.message);
        res.status(500).json({ error: 'Ошибка входа' });
    }
});

// ============================================
// ПОЛУЧЕНИЕ ПРОФИЛЯ
// ============================================
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
        console.log(`🔑 Пароль обновлён для user ${req.user.id}, rows affected: ${result.rowCount}`);
    } catch (error) {
        console.error('❌ Ошибка смены пароля:', error.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;