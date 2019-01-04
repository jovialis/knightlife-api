const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const News = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    schedule: {
        start: {
            type: Date,
            required: true
        },
        end: Date
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    alert: {
        type: Boolean,
        default: false
    },
    persist: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'news',
    versionKey: false
});

mongoose.model('News', News);