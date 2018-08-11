const mongoose = require("mongoose");

const LunchItem = new mongoose.Schema({
    name: String,
    itemType: String,
    allergy: {
        type: String,
        required: false
    }
}, {
    _id: false
});

const Lunch = new mongoose.Schema({
	date: {
		type: Date,
		select: false
	},
	description: {
		type: String,
		required: false
	},
	items: [LunchItem]
}, {
	collection: "lunches",
    versionKey: false
});

module.exports = mongoose.model("Lunch", Lunch);