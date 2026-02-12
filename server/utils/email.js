const nodemailer = require('nodemailer');

// Настройка транспорта (используй переменные окружения!)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Генерация 6-значного кода
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Отправка кода подтверждения
const sendVerificationCode = async (toEmail, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Код подтверждения — Финансовый трекер',
        html: `
            <h2>Подтверждение регистрации</h2>
            <p>Ваш код подтверждения:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5;">${code}</h1>
            <p>Код действителен в течение 15 минут.</p>
            <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
        `
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = { generateCode, sendVerificationCode };