const mongoose = require("mongoose");

const Vacation = new mongoose.Schema({
	start: Date,
    end: Date,
    description: {
        type: String,
        required: false
    }
}, {
	collection: "vacations",
    versionKey: false
});

module.exports = mongoose.model("Vacation", Vacation);