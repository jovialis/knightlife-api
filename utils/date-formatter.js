module.exports = function (date) {
	if (!date) { // No date supplied
		return null
	}

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return `${year}-${(month < 10 ? "0" : "")}${month}-${day}`;
};
