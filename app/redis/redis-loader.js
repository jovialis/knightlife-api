global.__redis = `${ __basedir }/app/redis/redis-loader`;

const redis = require('redis');

module.exports = redis.createClient({
    url: process.env.REDIS_URL
});