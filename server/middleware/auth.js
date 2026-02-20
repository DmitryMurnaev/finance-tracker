const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
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
        req.user = {
            id: parseInt(decoded.userId, 10),
            email: decoded.email
        };
        next();
    } catch (err) {
        console.error('❌ JWT Error:', err.message);
        return res.status(403).json({ error: 'Недействительный токен' });
    }
};

module.exports = { authMiddleware, JWT_SECRET };