const mongoose = require("mongoose");

const Survey = new mongoose.Schema({
    version: String,
    url: String,
}, {
    collection: "surveys"
});

mongoose.model("Survey", Survey);