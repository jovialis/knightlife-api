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
	description: {
		type: String,
		required: false,
		select: true
	},
	items: mongoose.Schema.Types.Mixed
}, {
	collection: "lunches"
});

module.exports = mongoose.model("Lunch", schema);