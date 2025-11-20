const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next(); // حتما باید صدا زده شود تا به مرحله بعد برود
};
module.exports = logger;
