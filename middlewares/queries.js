module.exports.parseCategories = (req, res, next) => {
	let categories = req.query.categories;

	if (categories !== undefined) {
		categories = categories.split(',');
	} else {
		categories = [];
	}

	req.categories = categories;
	next();
};

module.exports.parseFilters = async (req, res, next) => {
	let rawFilters = req.query.filters;
	let filters = {};

	if (rawFilters !== undefined) {
		try {
			// Format: key:value,key:value,key:value
			rawFilters = rawFilters.split(',');
			for (const filter of rawFilters) {
				const split = filter.split(':');

				const key = split[0];
				let value = split[1];

				// If the value is a number, parse it as an integer instead of a String
				const numberValue = Number(value);
				if (!isNaN(numberValue)) {
					value = numberValue;
				}

				filters[key] = value;
			}
		} catch (err) {
			console.log(err);
		}
	}

	req.filters = filters;
	next();
};