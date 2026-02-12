const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // ✅ явно преобразуем userId в число
        req.user = { id: parseInt(decoded.userId, 10) };
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Недействительный токен' });
    }
};

module.exports = { authMiddleware, JWT_SECRET };