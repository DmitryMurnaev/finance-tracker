const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Тестирование подключения к PostgreSQL...');
console.log('📋 Параметры подключения:');
console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`  Port: ${process.env.DB_PORT || 5432}`);
console.log(`  Database: ${process.env.DB_NAME || 'finance_tracker'}`);
console.log(`  User: ${process.env.DB_USER || 'finance_user'}`);

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'finance_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'ichigo21',
});

async function testConnection() {
    let client;
    try {
        console.log('\n🔄 Устанавливаем соединение...');
        client = await pool.connect();
        console.log('✅ Соединение с PostgreSQL установлено!');

        // Проверяем версию PostgreSQL
        const versionResult = await client.query('SELECT version()');
        console.log(`📊 Версия PostgreSQL: ${versionResult.rows[0].version.split(',')[0]}`);

        // Проверяем таблицу transactions
        const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transactions'
      )
    `);

        if (tableCheck.rows[0].exists) {
            console.log('✅ Таблица "transactions" существует');

            // Считаем записи
            const countResult = await client.query('SELECT COUNT(*) FROM transactions');
            console.log(`📈 Записей в таблице: ${countResult.rows[0].count}`);

            // Показываем пример данных
            const sampleResult = await client.query('SELECT * FROM transactions LIMIT 3');
            console.log('\n📋 Пример данных:');
            sampleResult.rows.forEach((row, i) => {
                console.log(`  ${i+1}. ${row.type === 'income' ? '📈 Доход' : '📉 Расход'}: ${row.amount} руб. (${row.category})`);
            });
        } else {
            console.log('❌ Таблица "transactions" не найдена');
        }

        client.release();
        console.log('\n🎉 Тестирование завершено успешно!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Ошибка подключения:', error.message);
        console.error('💡 Проверьте:');
        console.error('  1. Запущен ли PostgreSQL сервер');
        console.error('  2. Правильность параметров в .env файле');
        console.error('  3. Существует ли база данных и пользователь');

        if (client) client.release();
        process.exit(1);
    }
}

testConnection();