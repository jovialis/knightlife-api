const redis = require('redis');

module.exports.init = () => {
    mongoose.connect(process.env.REDIS_URL);
}