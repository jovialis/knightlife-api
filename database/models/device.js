const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	token: String
}, {
	collection: "devices",
    versionKey: false
});

module.exports = mongoose.model("Device", schema);