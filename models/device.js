const mongoose = require('mongoose');

const Device = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    version: {
        type: String,
        default: '3.0.2'
    }
}, {
    collection: 'devices'
});

mongoose.model('Device', Device);