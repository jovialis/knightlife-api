const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const AudienceSchema = new mongoose.Schema({
	grade: {
		type: Number,
		required: true
	},
	mandatory: {
		type: Boolean,
		default: false
	}
});

const EventSchema = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	calendarRaw: { // The raw data from remote event. Is null if not a remote event, otherwise is set to the raw input to allow for versioning.
		type: String,
		default: null
	},
	hidden: { // Whether or not to show this event should be hidden. This should only be true if we're removing a remote event and want to prevent it from being readded.
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		required: true
	},
	schedule: {
		blocks: { // These are the badges of all blocks during which this event occurrs on that day.
			type: [String],
			default: null
		},
		start: {
			type: Date,
			default: null
		},
		end: {
			type: Date,
			default: null
		}
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: null
	},
	location: {
		type: String,
		default: null
	},
	flags: {
		changed: {
			type: Boolean,
			default: false
		},
		cancelled: {
			type: Boolean,
			default: false
		},
		postponed: {
			type: Boolean,
			default: false
		}
	},
	categories: {
		type: [String],
		default: []
	}
}, {
	collection: 'events',
	discriminatorKey: 'kind'
});

// Populate schema for sports events. Moving this to another schema won't work. I've tried
EventSchema.pre('find', function (next) {
	this.populate('team');
	next();
});

const Event = mongoose.model('Event', EventSchema);

/*
* ART EVENTS
* */

Event.discriminator('ArtsEvent', new mongoose.Schema({
	categories: {
		type: [String],
		default: ['art']
	}
}));

/*
* COLOR WARS EVENTS
* */

Event.discriminator('ColorWarsEvent', new mongoose.Schema({
	points: {
		gold: {
			type: Number,
			default: -1
		},
		blue: {
			type: Number,
			default: -1
		},
		white: {
			type: Number,
			default: -1
		},
		black: {
			type: Number,
			default: -1
		}
	},
	categories: {
		type: [String],
		default: ['colorwars']
	}
}));

/*
* SCHOOL EVENTS
* */

Event.discriminator('SchoolDayEvent', new mongoose.Schema({
	audience: {
		type: [AudienceSchema],
		default: null
	},
	categories: {
		type: [String],
		default: ['school', 'school-day']
	}
}));

Event.discriminator('AllSchoolEvent', new mongoose.Schema({
	audience: {
		type: [AudienceSchema],
		default: null
	},
	categories: {
		type: [String],
		default: ['school', 'school-all']
	}
}));

Event.discriminator('UpperSchoolEvent', new mongoose.Schema({
	audience: {
		type: [AudienceSchema],
		default: null
	},
	categories: {
		type: [String],
		default: ['school', 'school-upper']
	}
}));

/*
* SPORTS EVENTS
* */

// Event.discriminator('SportsPracticeEvent', new mongoose.Schema({
// 	team: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: 'SportsTeam',
// 		required: true
// 	},
// 	teamId: {
// 		type: Number
// 	},
// 	categories: {
// 		type: [String],
// 		default: ['sports', 'sports-practice']
// 	}
// }));
//
Event.discriminator('SportsGameEvent', new mongoose.Schema({
	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SportsTeam',
		required: true
	},
	teamId: {
		type: Number
	},
	opponents: {
		type: [String],
		default: []
	},
	home: {
		type: Boolean,
		required: true
	},
	score: {
		type: new mongoose.Schema({
			bbn: {
				type: Number,
				default: -1
			},
			opponent: {
				type: Number,
				default: -1
			}
		}, {
			_id: false
		}),
		default: () => ({})
	},
	categories: {
		type: [String],
		default: ['sports', 'sports-game']
	}
}));
//
// Event.discriminator('SportsTournamentEvent', new mongoose.Schema({
// 	team: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: 'SportsTeam',
// 		required: true
// 	},
// 	teamId: {
// 		type: Number
// 	},
// 	tournament: {
// 		type: String,
// 		default: null
// 	},
// 	home: {
// 		type: Boolean,
// 		required: true
// 	},
// 	categories: {
// 		type: [String],
// 		default: ['sports', 'sports-tournament']
// 	}
// }));
