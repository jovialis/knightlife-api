const mongoose = require("mongoose");

const Vacation = new mongoose.Schema({
	start: Date,
    end: Date,
    name: {
        type: String,
        required: false
    }
}, {
	collection: "vacations"
});

module.exports = mongoose.model("Vacation", Vacation);