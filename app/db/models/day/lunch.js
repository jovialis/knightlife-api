// Complication

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Food = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    name: {
        type: String,
        required: true
    },
    allergy: String
}, {
    collection: 'foods'
});

const Lunch = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    title: String,
    items: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Food',
        default: []
    }
}, {
    collection: 'lunches'
});

mongoose.model('Food', Food);
mongoose.model('Lunch', Lunch);