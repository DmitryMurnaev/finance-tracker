require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Finance Tracker API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/api/transactions', (req, res) => {
    res.json({
        message: 'Transactions endpoint',
        data: []
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});