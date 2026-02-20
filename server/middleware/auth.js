const jwt = require('jsonwebtoken');
const { pool } = require('../db'); // добавили импорт БД

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = async (req, res, next) => {
    console.log('🔐 Headers:', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ No token');
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Decoded:', decoded);

        // Базовые данные из токена
        req.user = {
            id: parseInt(decoded.userId, 10),
            email: decoded.email,
            name: decoded.name
        };

        // Если email или name отсутствуют (старые токены) – подгрузим из БД
        if (!req.user.email || !req.user.name) {
            const result = await pool.query(
                'SELECT email, name FROM users WHERE id = $1',
                [req.user.id]
            );
            if (result.rows.length > 0) {
                req.user.email = result.rows[0].email;
                req.user.name = result.rows[0].name;
            }
        }

        next();
    } catch (err) {
        console.error('❌ JWT Error:', err.message);
        return res.status(403).json({ error: 'Недействительный токен' });
    }
};

module.exports = { authMiddleware, JWT_SECRET };