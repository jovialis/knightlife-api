const mongoose = require("mongoose");

const Audience = new mongoose.Schema({
    grade: Number,
    mandatory: Boolean
}, {
    _id: false
});

const Event = new mongoose.Schema({
	date: Date,
	block: String,
	description: String,
	audience: [Audience]
}, {
	collection: "events",
    versionKey: false
});

module.exports = mongoose.model("Event", Event);