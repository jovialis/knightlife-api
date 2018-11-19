const mongoose = require("mongoose");

const Block = new mongoose.Schema({
    id: String,
    start: String,
    end: String,
    variation: {
        type: Number,
        required: false
    }
}, {
    _id: false
});

const Day = new mongoose.Schema({
    id: String,
    blocks: [Block]
}, {
    _id: false
});

const Template = new mongoose.Schema({
	days: [Day]
}, {
    collection: "template",     
    versionKey: false
});

module.exports = mongoose.model("Template", Template);