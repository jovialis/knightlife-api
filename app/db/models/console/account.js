const mongoose = require('mongoose');
const shortid = require('shortid');

const Account = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
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
        default: shortid.generate
    }
}, {
    collection: "accounts",
    versionKey: false
});

mongoose.model("Account", Account);