const express = require('express');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

router.post('/', authMiddleware, async (req, res) => {
    const { topic, message, contact } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(500).json({ error: 'Telegram не настроен' });
    }

    try {
        const topicText = {
            question: '❓ Вопрос',
            problem: '⚠️ Техническая проблема',
            wish: '✨ Пожелание',
            other: '📝 Другое'
        }[topic] || '📝 Сообщение';

        const userName = req.user.name ? ` (${req.user.name})` : '';
        const text = `📬 *Новое обращение в поддержку*\n\n` +
            `*Пользователь:* ${req.user.id}${userName}\n` +
            `*Email:* ${req.user.email}\n` +
            `*Тема:* ${topicText}\n` +
            `*Контакт:* ${contact || 'не указан'}\n\n` +
            `*Сообщение:*\n${message}`;

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        }, { timeout: 5000 });

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Ошибка отправки в Telegram:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        });
        res.status(500).json({ error: 'Ошибка отправки' });
    }
});

module.exports = router;