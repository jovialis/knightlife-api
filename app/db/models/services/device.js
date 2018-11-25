const mongoose = require('mongoose');

const Device = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, {
    collection: 'devices',
    versionKey: false
});

mongoose.model('Device', Device);