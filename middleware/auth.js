const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // کلید API را باید در فایل .env تعریف کنید
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        const error = new Error('Unauthorized access');
        error.status = 401;
        next(error); // پاس دادن خطا به Error Handler
    }
};
module.exports = auth;
