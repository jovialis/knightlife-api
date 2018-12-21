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
    allergy: {
        type: String,
        default: null
    },
    nameLower: String
}, {
    collection: 'foods'
});

Food.pre('save', function (next) {    
    this.nameLower = this.name.toLowerCase();
    next();
});

const Lunch = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    title: {
        type: String,
        default: null
    },
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