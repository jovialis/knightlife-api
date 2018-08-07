module.exports.path = "notify";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(require(formatter.error("Invalid date requested")));
		return
	}

	const endDate = new Date(date).setDate(date.getDate() + 14);

	const sample = {
		'content': [
			{
				'date': '2018-8-5',
				'mode': [0, 2] // 0 = patch, 1 = events
			},
			{
				'date': '2018-8-6',
				'mode': [1]
			}
		]
	};

	fetchSchedule(date, endDate, function(error, result) {
		if (error) {
			console.log(error);

			res.json(formatter.error(error));
			return;
		}

		let objectList = result;

		fetchEvents(date, endDate, function(error, result) {
			if (error) {
				console.log(error);

				res.json(formatter.error(error));
				return;
			}

			objectList.push(result);

			const normalizedList = normalizeList(objectList);
			res.json(formatter.success(normalizedList, "notification stack", date));
		});
	});
};

// then: (error, objects)
function fetchSchedule(date, endDate, then) {
	require(`${__basedir}/database/models/schedule`).find({
		date: { $gte: date, $lte: endDate }
	}, function (error, object) {
        let resultList = [];
		object.forEach(function(item) {
			resultList.push({
                'type': 'schedule',
                'date': item["date"]
            });
		});
        
		then(error, resultList);
	});
}

function fetchEvents(date, endDate, then) {
	require(`${__basedir}/database/models/event`).find({
		date: { $gte: date, $lte: endDate }
	}, function (error, object) {
        let resultList = [];
		object.forEach(function(item) {
			resultList.push({
                'type': 'event',
                'date': item["date"]
            });
		});
        
		then(error, resultList);
	});
}

function normalizeList(objects) {
    /*
    objects: [{
        'date': '-',
        'type': '-'
    }]
    
    converted through this method to layerA:
    
    '2018-8-7': {
        'event': true,
        'schedule': true
    }
    
    converted to layerB:
    
    [{
        'date': '-',
        'modes': [0, 1]
    }]
    */
    
    let layerA = []
    
	for (let object in objects) {
        const date = object['date'];
        const type = object['type'];
        
        let layerObject = layerA[date];
        if (layerObject) {
            layerObject[type] = true;
        } else {
            let fillObject = { };
            fillObject[type] = true;
            layerA[date] = fillObject;
        }
    }
    
    let layerB = [];
    for (const key in layerA) {
        const hasSchedule = layerA[key]['schedule'];
        const hasEvents = layerA[key]['event'];
        
        let modes = [];
        if (hasSchedule) { modes.push(0); }
        if (hasEvents) { modes.push(1) };
        
        layerB.push({
            'date': key,
            'mode': modes
        });
    }
    
    return layerB;
}