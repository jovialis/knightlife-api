// Complication

const mongoose = require('mongoose');

const Food = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    allergy: String
}, {
    collection: 'foods'
});

const Lunch = new mongoose.Schema({
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