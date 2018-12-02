const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');

module.exports.generate = (account) => {
    const badge = account.badge;
    const state = account.state;
    
    // This is used to keep track of assigned tokens. This'll be useful if, in the future, we want to store each token ID to keep track of them and individually remove sessions.
    const tokenUUID = uuid();
    
    const token = {
        id: tokenUUID,
        badge: badge,
        state: state
    };
    
    return jwt.sign(token, process.env.JWT_SECRET);
}