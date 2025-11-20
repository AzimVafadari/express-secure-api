const users = require('../models/user');

// دریافت همه کاربران
exports.getAllUsers = (req, res) => {
    res.status(200).json({ success: true, data: users });
};

// ایجاد کاربر جدید
exports.createUser = (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json({ success: true, data: newUser });
};
