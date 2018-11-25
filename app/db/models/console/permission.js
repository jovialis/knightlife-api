const mongoose = require('mongoose');
const Account = mongoose.model('Account');

const Permission = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    giver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    expiration: {
        type: Date,
        default: null
    },
    permission: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    collection: 'permissions'
});

mongoose.model('Permission', Permission);