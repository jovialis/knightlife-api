const mongoose = require("mongoose");

const Audience = new mongoose.Schema({
    grade: Number,
    mandatory: Boolean
}, {
    _id: false
});

const EventTime = new mongoose.Schema({
    start: String,
    end: {
        type: String,
        required: false
    }
}, {
    _id: false
});

const Event = new mongoose.Schema({
	date: Date,
	block: {
        type: String,
        required: false
    },
    time: {
        type: EventTime,
        required: false
    },
	description: String,
	audience: [Audience]
}, {
	collection: "events",
    versionKey: false
});

module.exports = mongoose.model("Event", Event);