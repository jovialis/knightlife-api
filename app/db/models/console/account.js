const mongoose = require('mongoose');
const shortid = require('shortid');

const Account = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    displayname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    passhash: {
        type: String,
        required: false
    },
    state: {
        type: String,
        default: shortid.generate
    }
}, {
	collection: "accounts",
    versionKey: false
});

mongoose.model("Account", Account);