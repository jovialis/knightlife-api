global.__basedir = __dirname;

require("./app/db/mongoose").init(); // Start mongo connection
require('./app/routing/router').init();