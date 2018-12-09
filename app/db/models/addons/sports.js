const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Team = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    }
}, {
    collection: 'sportteams'
});

mongoose.model('SportTeam', Team);

let SportEvent = new mongoose.Schema({
    uid: {
        type: String,
        default: null,
    },
    source: {
        type: String,
        default: null
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportTeam',
        required: true
    },
    time: {
        start: {
            type: Date,
            required: true
        }
    },
    at: {
        location: {
            type: String,
            default: null
        }
    }
}, {
    collection: 'sportevents'
});

SportEvent = mongoose.model('SportEvent', SportEvent);

const GameScore = new mongoose.Schema({
    bbn: {
        type: Number,
        default: 0
    },
    opponent: {
        type: Number,
        default: 0
    }
});

const SportGame = SportEvent.discriminator('SportGame', new mongoose.Schema({
    opponent: {
        type: String,
        required: true
    },
    at: {
        home: {
            type: Boolean,
            default: true
        }
    },
    score: {
        type: GameScore,
        default: null
    }
}));

const SportPractice = SportEvent.discriminator('SportPractice', new mongoose.Schema({
    time: {
        end: {
            type: Date,
            default: null
        }
    }
}));