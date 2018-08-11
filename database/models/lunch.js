const mongoose = require("mongoose");

const schema = new mongoose.Schema({
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
		itemType: String,
		allergy: {
			type: String,
			required: false
		}
	}]
}, {
	collection: "lunches",
    versionKey: false
});

module.exports = mongoose.model("Lunch", schema);