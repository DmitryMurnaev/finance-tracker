const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
    // На Render используем DATABASE_URL
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    // Локально — из переменных окружения или захардкоженные параметры
    pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'finance_tracker_jm5c',
        user: process.env.DB_USER || 'finance_tracker_jm5c_user',
        password: process.env.DB_PASSWORD || 'dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
}

pool.on('connect', () => console.log('✅ [db.js] Подключение к PostgreSQL установлено'));
pool.on('error', (err) => console.error('❌ [db.js] Ошибка пула:', err.message));

module.exports = { pool };