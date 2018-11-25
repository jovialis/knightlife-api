global.__basedir = __dirname;

require('./app/db/mongoose-loader').init(); // Start mongo connection
require('./app/routing/route-loader').init();