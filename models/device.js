const mongoose = require('mongoose');

const Device = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    }
}, {
    collection: 'devices'
});

mongoose.model('Device', Device);