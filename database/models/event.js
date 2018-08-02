const mongoose = require("mongoose");

let schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	date: {
		type: String,
		required: true,
		select: false
	},
	block: {
		type: String,
		required: true,
		select: true
	},
	description: {
		type: String,
		required: false,
		select: true
	},
	audience: mongoose.Schema.Types.Mixed,
	items: mongoose.Schema.Types.Mixed
}, {
	collection: "events"
});

module.exports = mongoose.model("Event", schema);