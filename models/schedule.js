// Complication

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Annotation = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	message: {
		type: String,
		required: true
	},
	target: {
		type: Number,
		default: 0
	},
	meta: {
		location: String,
		color: String
	}
}, {
	_id: false
});

const Block = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	id: {
		type: String,
		required: true,
		enum: require('../controllers/schedule').template.blockIds
	},
	firstLunch: {
		type: Boolean,
		required: false
	},
	time: {
		start: {
			type: String,
			required: true
		},
		end: {
			type: String,
			required: true
		}
	},
	annotations: {
		type: [Annotation],
		default: []
	}
}, {
	_id: false
});

const Timetable = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	blocks: {
		type: [Block]
	},
	grades: { // 0 = freshman, etc.
		type: [ Number ],
		default: [  ]
	},
	title: {
		type: String,
		default: null
	} // For specific names: e.g. instead of Freshman block schedule, Freshman Exam Schedule
}, {
	_id: false
});

const Schedule = new mongoose.Schema({
	badge: {
		type: String,
		default: uuid
	},
	date: {
		type: Date,
		required: true,
		unique: true
	},
	timetables: {
		type: [Timetable],
		required: true
	},
	day: Number
}, {
	collection: 'schedules'
});

mongoose.model('Schedule', Schedule);