require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Import Middlewares & Routes
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const formatResponse = require('./middleware/formatResponse');
const userRoutes = require('./routes/user');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Security Middleware (Helmet) ---
// هدرهای امنیتی HTTP را تنظیم می‌کند
app.use(helmet());

// --- 2. CORS Configuration ---
// تنظیم دسترسی دامنه‌های مجاز از فایل env
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
app.use(cors({
    origin: (origin, callback) => {
        // اجازه به درخواست‌های بدون origin (مثل Postman یا سرور به سرور)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // بازه زمانی ۱۵ دقیقه
    max: 100, // حداکثر ۱۰۰ درخواست برای هر IP
    standardHeaders: true, // برگرداندن هدرهای استاندارد RateLimit در پاسخ
    legacyHeaders: false, // غیرفعال کردن هدرهای قدیمی X-RateLimit
    message: {
        success: false,
        error: {
            message: "Too many requests, please try again later.",
            status: 429
        }
    }
});

// --- 3. Compression ---
// فشرده‌سازی پاسخ‌ها برای سرعت بیشتر
app.use(compression());

// --- 4. Logging (Morgan) ---
// ثبت لاگ‌ها
app.use(morgan('combined')); // یا 'dev' برای محیط توسعه

// --- 5. Body Parsers ---
app.use(express.json());

// --- 6. Custom Response Formatter ---
app.use(formatResponse);

// --- 7. Rate Limiter (از فاز ۱) & Auth ---
// فرض بر این است که این‌ها را از قبل داری، اینجا فراخوانی می‌شوند
// app.use(rateLimiter); // اگر در فاز ۱ داشتی
//
//

app.use('/api', limiter);
app.use('/api', authMiddleware); // حفاظت از همه روت‌های api

// --- 8. Routes ---
app.use('/api/users', userRoutes);

// --- 9. Root Route ---
app.get('/', (req, res) => {
    res.json({ message: "Secure API is running..." });
});

// --- 10. Error Handling ---
// میدل‌ور مدیریت خطا باید همیشه آخرین باشد
app.use(errorHandler);

// --- Server Startup ---
// اگر فایل‌های SSL را داری (از فاز ۱)
try {
    const sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🔒 Secure Server running on https://localhost:${PORT}`);
    });
} catch (error) {
    console.log("SSL files not found, falling back to HTTP");
    app.listen(PORT, () => {
        console.log(`⚙️ Server running on http://localhost:${PORT}`);
    });
}
