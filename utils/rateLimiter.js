const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowsMs: 10 * 60 * 10000,
    limit: 100,
    standardHeaders: true,
})

module.exports = {limiter};