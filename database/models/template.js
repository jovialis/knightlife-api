var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	days: [{
		id: { type: String, select: false },
		blocks: [{
			id: String,
			start: String,
			end: String,
			variation: { type: Number, required: false }
		}]
	}]
}, {collection: "template"});

module.exports = mongoose.model("Template", schema);