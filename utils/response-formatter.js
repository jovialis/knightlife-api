module.exports.success = function(data, type, day) {
	return {
		'content': data,
		'error': null,
		'attributes': {
			'day': day,
			'type': type
		}
	};
};

module.exports.error = function(error) {
	return {
		'content': null,
		'error': String(error),
		'attributes': {
			'day': null,
			'type': null
		}
	}
};