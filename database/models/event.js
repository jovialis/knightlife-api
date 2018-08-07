const mongoose = require("mongoose");

let schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	date: {
		type: Date,
		select: false
	},
	block: String,
	description: String,
	audience: [{
		grade: Number,
		mandatory: Boolean
	}]
}, {
	collection: "events"
});

module.exports = mongoose.model("Event", schema);