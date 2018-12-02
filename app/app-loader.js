global.__interface = `${ __basedir }/app/interface`;

require('./db/mongoose-loader').init(); // Start mongo connection
require('./routing/route-loader').init();