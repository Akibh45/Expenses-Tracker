const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();

let redisClient = null;

if (process.env.USE_REDIS === 'true') {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  redisClient.on('connect', () => {
      console.log('Redis connected successfully');
  });

  redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message);
  });
} else {
  console.log('Redis is disabled (USE_REDIS is not set to true). Skipping cache.');
}

module.exports = redisClient;
