module.exports = function(rawDate) {
	if (!rawDate) { // No date supplied
		return null
	}

	let parsed = new Date(rawDate)
	if (!parsed) {
		console.log("Invalid date: " + date)
		return null
	}

	return `${parsed.getFullYear()}-${parsed.getMonth()}-${parsed.getDate()}`
}