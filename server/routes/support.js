const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

router.post('/', authMiddleware, async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(500).json({ error: 'Telegram не настроен' });
    }

    try {
        const text = `📬 Сообщение от пользователя ${req.user.id} (${req.user.email}):\n\n${message}`;
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
        });
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Ошибка отправки в Telegram:', err.message);
        res.status(500).json({ error: 'Ошибка отправки' });
    }
});

module.exports = router;