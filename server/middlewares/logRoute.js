// middlewares/logRoute.js
const logRoute = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next(); // don’t forget to call next()!
};

module.exports = logRoute;
