const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	token: {
        type: String,
        unique: true
    }
}, {
	collection: "devices",
    versionKey: false
});

module.exports = mongoose.model("Device", schema);