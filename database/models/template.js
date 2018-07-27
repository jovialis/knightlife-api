var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		select: false
	},
	items: mongoose.Schema.Types.Mixed
}, {collection: "template"})

module.exports = mongoose.model("Template", schema)