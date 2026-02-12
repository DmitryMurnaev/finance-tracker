// ⚠️ ВРЕМЕННАЯ ТЕСТОВАЯ ВЕРСИЯ — без реальной отправки почты
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationCode = async (toEmail, code) => {
    console.log(`📧 [ТЕСТ] Код подтверждения для ${toEmail}: ${code}`);
    // Всегда успех
    return { success: true };
};

module.exports = { generateCode, sendVerificationCode };