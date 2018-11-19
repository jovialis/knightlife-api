const mongoose = require("mongoose");

const WebUser = new mongoose.Schema({
    name: String,
    email: String,
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