const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'dpg-d6626fmr433s73d8dcq0-a.oregon-postgres.render.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'finance_tracker_jm5c',
    user: process.env.DB_USER || 'finance_tracker_jm5c_user',
    password: process.env.DB_PASSWORD || 'dNwYoVlWRsKrudOp8gsOGwoxwx6Lkh7x',
    ssl: { rejectUnauthorized: false }
});

module.exports = { pool };