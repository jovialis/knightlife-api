const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	date: {
		type: Date,
		select: false
	},
	description: {
		type: String,
		required: false
	},
	items: [{
		name: String,
		type: String,
		allergy: {
			type: String,
			required: false
		}
	}]
}, {
	collection: "lunches"
});

module.exports = mongoose.model("Lunch", schema);