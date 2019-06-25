const cors = require('cors');

module.exports.wwwKL = cors({
	credentials: true,
	origin: 'https://www.bbnknightlife.com/'
});