const mongoose = require('mongoose');
const uuid = require('uuid/v4');

module.exports.registerMiddleware = (schema) => {

    schema.pre('find', function(next) {
        this.populate('team');
        next();
    });

};

module.exports.register = (model) => {

    const Team = mongoose.model('SportsTeam', new mongoose.Schema({
        badge: {
            type: String,
            default: uuid
        },
        calendarId: {
            type: Number,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        sport: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        }
    }, {
        collection: 'sportsteams'
    }));

    const SportsPracticeSchema = new mongoose.Schema({
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SportsTeam',
            required: true
        },
        teamId: {
            type: Number
        },
        categories: {
            type: [ String ],
            default: [ 'sports', 'sports-practice' ]
        }
    });

    const SportsPractice = model.discriminator('SportsPracticeEvent', SportsPracticeSchema);

    const GameScore = new mongoose.Schema({
        bbn: {
            type: Number,
            default: -1
        },
        opponent: {
            type: Number,
            default: -1
        }
    });

    const SportsGameSchema = new mongoose.Schema({
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SportsTeam',
            required: true
        },
        teamId: {
            type: Number
        },
        opponents: {
            type: [ String ],
            default: []
        },
        home: {
            type: Boolean,
            required: true
        },
        score: {
            type: GameScore
        },
        categories: {
            type: [ String ],
            default: [ 'sports', 'sports-game' ]
        }
    });

    const SportsGame = model.discriminator('SportsGameEvent', SportsGameSchema);

    const SportsTournamentSchema = new mongoose.Schema({
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SportsTeam',
            required: true
        },
        teamId: {
            type: Number
        },
        home: {
            type: Boolean,
            required: true
        },
        categories: {
            type: [ String ],
            default: [ 'sports', 'sports-tournament' ]
        }
    });

    const SportsTournament = model.discriminator('SportsTournamentEvent', SportsTournamentSchema);

}



