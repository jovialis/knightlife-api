const mongoose = require('mongoose');

const Device = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: 'DeviceProfile'
    }
}, {
    collection: 'devices',
    setDefaultsOnInsert: true // Needed to ensure DeviceProfile is saved
});

mongoose.model('Device', Device);

