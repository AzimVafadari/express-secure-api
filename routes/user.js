const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.js');

// قوانین اعتبارسنجی
const validateUser = [
    body('name')
        .trim()
        .notEmpty().withMessage('نام الزامی است')
        .isString().withMessage('نام باید رشته متنی باشد')
        .isLength({ min: 3 }).withMessage('نام باید حداقل ۳ کاراکتر باشد'),
    body('age')
        .notEmpty().withMessage('سن الزامی است')
        .isInt({ min: 1, max: 120 }).withMessage('سن باید یک عدد مثبت معتبر باشد')
];

router.get('/', userController.getUsers);
router.post('/', validateUser, userController.createUser);

module.exports = router;
