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
        ref: 'DeviceProfile',
        default: async function() {
            // Generate ObjectId for the profile
            const profileId = mongoose.Types.ObjectId();
            const DeviceProfile = mongoose.model('DeviceProfile');

            // Create profile document
            await DeviceProfile.create({
                _id: profileId
            });

            return profileId
        }
    }
}, {
    collection: 'devices',
    setDefaultsOnInsert: true // Needed to ensure DeviceProfile is saved
});

mongoose.model('Device', Device);

