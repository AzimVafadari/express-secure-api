const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
// فرض بر این است که مدل User را داری، اگر نداری یک آرایه فرضی استفاده می‌کنیم
const users = []; 

exports.getUsers = asyncHandler(async (req, res) => {
    // شبیه‌سازی عملیات دیتابیس
    res.status(200).json(users);
});

exports.createUser = asyncHandler(async (req, res) => {
    // ۱. بررسی نتیجه اعتبارسنجی
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Validation failed",
                status: 400,
                details: errors.array()
            }
        });
    }

    // ۲. ایجاد کاربر
    const { name, age } = req.body;
    const newUser = { id: Date.now(), name, age };
    users.push(newUser);

    res.status(201).json(newUser);
});
