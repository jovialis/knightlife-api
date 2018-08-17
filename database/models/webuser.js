const mongoose = require("mongoose");

const WebUser = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
	gid: {
        type: String,
        unique: true
    }
}, {
	collection: "webusers",
    versionKey: false
});

module.exports = mongoose.model("WebUser", WebUser);