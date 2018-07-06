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
	subtitle: {
		type: String,
		required: false,
		select: true
	},
	items: mongoose.Schema.Types.Mixed
}, { collection: "lunches" })

module.exports = mongoose.model("Lunch", schema)