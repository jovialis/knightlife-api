const redis = require('redis');

module.exports.init = () => {
    redis.createClient(process.env.REDIS_URL);
}