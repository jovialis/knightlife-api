const mongoose = require('mongoose');

module.exports.path = 'schedule';

module.exports.create = (day) => {
    return new Promise((resolve, reject) => {
        const Schedule = mongoose.model('Schedule');

        const date = day.date;
        const dayIndex = date.getDay() - 1; // So monday is 0, sunday is 6
        
        // Sunday wrap around, because mod doesn't work in JS.
        if (dayIndex === -1) {
            dayIndex = 6;
        }

        const template = require('./schedule-template.json');
        const dayBlocks = template.days[dayIndex].blocks;

        // We try to find one first; we don't return a new instance if one already exists

        Schedule.create({
            schedules: [
                {
                    blocks: dayBlocks
                }
            ]
        }, (err, schedule) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(schedule);
        });
    });
}