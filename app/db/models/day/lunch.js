// Complication

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Food = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allergy: {
        type: String,
        default: null
    },
    nameLower: String,
    allergyLower: {
        type: String,
        default: null
    }
}, {
    collection: 'foods'
});

Food.pre('save', function (next) {    
    this.nameLower = this.name.toLowerCase();

    if (this.allergy) {
        this.allergyLower = this.allergy.toLowerCase();
    } else {
        this.allergyLower = null;
    }
    
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

Lunch.pre('save', function (next) {
    // Increment version ID
    this.increment();
    next();
});

mongoose.model('Food', Food);
mongoose.model('Lunch', Lunch);