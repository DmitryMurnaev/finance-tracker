const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'postbox.cloud.yandex.net',
    port: 465,
    secure: true,
    auth: {
        user: process.env.YANDEX_SMTP_USER,
        pass: process.env.YANDEX_SMTP_PASSWORD
    }
});

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationCode = async (toEmail, code) => {
    const mailOptions = {
        from: process.env.POSTBOX_FROM_ADDRESS || '"Финансовый трекер" <noreply@postbox.cloud.yandex.net>',
        to: toEmail,
        subject: 'Код подтверждения — Финансовый трекер',
        html: `<h2>Ваш код: ${code}</h2><p>Код действителен 15 минут.</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${toEmail}, messageId: ${info.messageId}`);
    return info;
};

module.exports = { generateCode, sendVerificationCode };