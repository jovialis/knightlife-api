const mongoose = require("mongoose");

const WebUser = new mongoose.Schema({
	googleId: {
        type: String,
        unique: true
    }
}, {
	collection: "webusers",
    versionKey: false
});

module.exports = mongoose.model("WebUser", WebUser);