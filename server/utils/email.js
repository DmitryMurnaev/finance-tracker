const nodemailer = require('nodemailer');

// Яндекс.Почта — работает 100%, без танцев с бубном
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.YANDEX_MAIL_USER,
        pass: process.env.YANDEX_MAIL_PASSWORD
    },
    // Таймауты — чтобы не висеть вечно
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
});

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationCode = async (toEmail, code) => {
    const mailOptions = {
        from: `"Финансовый трекер" <${process.env.YANDEX_MAIL_USER}>`,
        to: toEmail,
        subject: 'Код подтверждения — Финансовый трекер',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <h2 style="color: #4F46E5;">Подтверждение регистрации</h2>
                <p>Ваш код подтверждения:</p>
                <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5; background: #f3f4f6; padding: 10px 20px; display: inline-block; border-radius: 8px;">
                    ${code}
                </h1>
                <p>Код действителен в течение 15 минут.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${toEmail}, messageId: ${info.messageId}`);
        return { success: true };
    } catch (error) {
        console.error('❌ SMTP error:', error.message);
        throw error; // пробрасываем, фронт покажет таймаут/ошибку
    }
};

module.exports = { generateCode, sendVerificationCode };