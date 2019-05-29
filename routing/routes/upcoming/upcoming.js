// Special schedules
// Schedule notices
// Upcoming events
// upcomingType: 'schedule' ; 'notice' ; 'event'
const axios = require('axios');
const moment = require('moment');

module.exports = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return;
	}
    
    getChangedSchedules(date, function(error, result) {
        if (error) {
            console.log("Failed to fetch upcoming: " + error);
            
            res.json(formatter.error("Failed to fetch upcoming."));
            return;
        }
        
        const dateFormatter = require(`${__basedir}/utils/date-formatter`);
        res.json(formatter.success(result, "upcoming", dateFormatter(date)));
    });
};

function buildItem(type, date, data) {
    const dateFormatter = require(`${__basedir}/utils/date-formatter`);

    return {
        "upcomingType": type,
        "date": dateFormatter(date),
        "data": data
    }
}

function getChangedSchedules(date, callback) {
    require(`${__basedir}/database/models/schedule`).find({
		date: { 
            $gte: date, 
        },
        changed: true // Only fetch Schedules that have the Changed flag for a changed schedule.
	}, function (error, object) {
        if (error) {
            callback(error, null);
            return;
        }
        
        let resultList = [];        
		object.forEach(function(item) {
            resultList.push(buildItem("schedule", item["date"], {}));
		});
        
        getScheduleNotices(date, resultList, callback);
    });
}

function getScheduleNotices(date, list, callback) {
    require(`${__basedir}/database/models/schedule`).find({
		date: {
            $gte: date, 
        },
        notices: {
            $exists: true,
        }
    }, function (error, object) {
        if (error) {
            callback(error, null);
            return;
        }
        
		object.forEach(function(item) {
            item["notices"].forEach(function(notice) {
                list.push(buildItem("notice", item["date"], notice));
            });
		});
        
        getEvents(date, list, callback);
    });
}

function getEvents(date, list, callback) {
	let formatter = require(`${__basedir}/utils/date-formatter`);

	axios.get(`https://api.bbnknightlife.com/m/events`).then(eventRes => {
		if (eventRes.data) {
			// Map list of events to usable ones for old versions of Knight Life.
			eventRes.data.forEach(newEvent => {
				let basicDetails = {
					date: formatter(new Date(newEvent.date.split('T')[0])),
					description: newEvent.title
				};

				/// If it's a Block event, we convert the Block over
				if (newEvent.schedule.blocks.length !== 0) {
					basicDetails.block = newEvent.schedule.blocks[0];
				} else if (newEvent.schedule.start) {
					// Fill in Times
					const startDate = moment(newEvent.schedule.start).toDate();
					const endDate = newEvent.schedule.end ? moment(newEvent.schedule.end).toDate() : null;

					//("0" + myNumber).slice(-2)

					// Fill in Times
					basicDetails.time = {
						start: `${ ("0" + startDate.getHours()).slice(-2) }-${ ("0" + startDate.getMinutes()).slice(-2) }`,
						end: endDate ? ( `${ ("0" + (endDate.getHours() + 1)).slice(-2) }-${ ("0" + endDate.getMinutes()).slice(-2) }` ) : undefined
					};
				} else {
					// If there's nothing being scheduled, this Event effectively doesn't exist.
					return;
				}

				// If there is an audience specifieds
				if (newEvent.audience && newEvent.audience.length > 0) {
					basicDetails.audience = newEvent.audience.map(audience => {
						return {
							mandatory: audience.mandatory,
							grade: audience.grade + 1 // Old system has All School as 0, Freshman as 1, etc.
						};
					});
				}

				// Default Event audience
				// if (!basicDetails.audience) {
				// 	basicDetails.audience = [{
				// 		grade: 0,
				// 		mandatory: false
				// 	}];
				// }

				list.push(buildItem("event", date, basicDetails));
			});
		}

		callback(null, list);
	}).catch(error => {
		console.log(error);
		callback(error, null);
	});

}







