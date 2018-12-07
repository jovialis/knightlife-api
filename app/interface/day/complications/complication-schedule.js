const mongoose = require('mongoose');

module.exports.path = 'schedule';

module.exports.create = (day) => {
    return new Promise((resolve, reject) => {
        const Schedule = mongoose.model('Schedule');

        const date = day.date;
        const dayIndex = ((date.getDay() - 1) % 7); // So monday is 0, sunday is 6

        const template = require('./schedule-template.json');
        const dayBlocks = template.days[dayIndex].blocks;

        console.log('Building schedule for date ' + date);

        // We try to find one first; we don't return a new instance if one already exists
        
        console.log(dayBlocks);
        
        Schedule.create({
            schedules: [
                {
                    blocks: dayBlocks
                }
            ]
        }, (err, schedule) => {
            console.log('Err: ' + err + ' ' + schedule);


            if (err) {
                reject(err);
                return;
            }

            resolve(schedule);
        });
    });
}