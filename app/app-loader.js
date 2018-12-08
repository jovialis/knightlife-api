global.__interface = `${ __basedir }/app/interface`;

require('./db/mongoose-loader').init(); // Start mongo connection
require('./redis/redis-loader').init();

require('./routing/route-loader').init();