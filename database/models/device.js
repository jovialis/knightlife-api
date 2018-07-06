var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	token: {
		type: String,
		required: true,
		select: true
	}
}, { collection: "devices" })

module.exports = mongoose.model("Device", schema)