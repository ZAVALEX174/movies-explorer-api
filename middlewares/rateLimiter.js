const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../utils/errorMessage');

// За 15 минут можно совершить не более 100 запросов с одного IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: RATE_LIMIT,
});

module.exports = {
  limiter,
};
