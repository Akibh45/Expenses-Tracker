const redisClient = require('../config/redis');

const cache = async (req, res, next) => {
  if (!redisClient) {
    return next(); // Bypass cache if Redis is not initialized
  }

  try {
    const key = `cache:${req.user.id}:${req.originalUrl}`;
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Override res.json to cache response before sending
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Cache for 5 minutes (300 seconds)
      redisClient.setex(key, 300, JSON.stringify(body));
      originalJson(body);
    };

    next();
  } catch (err) {
    console.error('Cache middleware error:', err);
    next();
  }
};

module.exports = cache;
