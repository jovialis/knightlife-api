const mongoose = require("mongoose");

const Survey = new mongoose.Schema({
	version: String,
	url: String,
}, {
	collection: "surveys",
    versionKey: false
});

module.exports = mongoose.model("Survey", Survey);