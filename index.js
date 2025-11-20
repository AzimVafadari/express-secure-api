const fs = require('fs');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// بارگذاری متغیرهای محیطی
dotenv.config();

// ایمپورت ماژول‌های داخلی
const userRoutes = require('./routes/user');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. میان‌افزارهای عمومی
app.use(express.json()); // برای پارس کردن JSON
app.use(logger);

// 2. Rate Limiting (امنیت)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100, // حداکثر 100 درخواست برای هر IP
    message: "تعداد درخواست‌های شما بیش از حد مجاز است."
});
app.use(limiter);

// 3. مسیرها (Routes)
// اعمال Auth فقط روی مسیر کاربران
app.use('/users', auth, userRoutes);

// 4. مدیریت خطا (باید آخرین میان‌افزار باشد)
app.use(errorHandler);

// 5. راه‌اندازی سرور HTTPS
const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const PORT = process.env.PORT || 3000;

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Secure Server running on https://localhost:${PORT}`);
});

// مسیر صفحه اصلی (برای تست روشن بودن سرور)
app.get('/', (req, res) => {
    res.send('<h1>Server is Running! 🚀</h1><p>Go to /users to see the API.</p>');
});
