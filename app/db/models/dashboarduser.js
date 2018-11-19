const mongoose = require("mongoose");

const DashboardUser = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
	collection: "dashboardusers",
    versionKey: false
});

module.exports = mongoose.model("DashboardUser", DashboardUser);