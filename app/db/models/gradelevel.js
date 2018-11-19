const mongoose = require('mongoose');

const GradeLevel = new mongoose.Schema({
    $gl: {
        type: String,
        enum: ['all', 'freshman', 'sophomore', 'junior', 'senior'],
        default: 'all'
    }
}, {
    versionKey: false
});

module.exports = GradeLevel;