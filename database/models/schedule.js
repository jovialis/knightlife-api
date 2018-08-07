var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	date: { type: Date, select: false },
	description: { type: String, required: false },
	changed: { type: Boolean, required: false },
	day: { type: String, required: false },
	notices: { 
        type: [{
			priority: Number,
			message: String
		}], 
        required: false},
	blocks: [{
		id: String,
		start: String,
		end: String,
		variation: { type: Number, required: false },
		custom: {
			type: {
				name: String,
				color: String
			},
			required: false
		}
	}]
}, {
	collection: "schedules"
});

module.exports = mongoose.model("Schedule", schema);