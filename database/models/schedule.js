var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	date: {
		type: String,
		required: true,
		select: false
	},
	description: {
		type: String,
		required: false,
		select: true
	},
	changed: {
		type: Boolean,
		required: false,
		select: true
	},
	day: {
		type: String,
		required: false,
		select: true
	},
	blocks: mongoose.Schema.Types.Mixed
}, {
	collection: "schedules"
});

module.exports = mongoose.model("Schedule", schema);