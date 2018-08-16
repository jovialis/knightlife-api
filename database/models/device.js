const mongoose = require("mongoose");

const Device = new mongoose.Schema({
	token: {
        type: String,
        unique: true
    }
}, {
	collection: "devices",
    versionKey: false
});

module.exports = mongoose.model("Device", Device);