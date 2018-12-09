const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Account = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    username: {
        type: String,
        required: true
    },
    name: String,
    picture: String,
    passhash: String,
    state: {
        type: String,
        default: uuid
    }
}, {
    collection: "accounts"
});

mongoose.model("Account", Account);