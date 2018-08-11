const mongoose = require("mongoose");

const Notice = new mongoose.Schema({
    priority: Number,
    message: String
}, {
    _id: false
});

const Custom = new mongoose.Schema({
    name: String,
    color: String
}, {
    _id: false
})

const Block = new mongoose.Schema({
    id: String,
    start: String,
    end: String,
    variation: { 
        type: Number, 
        required: false 
    },
    custom: {
        type: Custom,
        required: false
    }
}, {
    _id: false
});

const Schedule = new mongoose.Schema({
	date: {
        type: Date, 
        select: false 
    },
	description: { 
        type: String, 
        required: false 
    },
	changed: { 
        type: Boolean, 
        required: false 
    },
	day: { 
        type: String, 
        required: false 
    },
	notices: { 
        type: [Notice], 
        required: false
    },
	blocks: [Block]
}, {
	collection: "schedules",
    versionKey: false
});

module.exports = mongoose.model("Schedule", Schedule);