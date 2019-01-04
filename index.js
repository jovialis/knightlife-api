global.__basedir = __dirname;

if (!process.env.PRODUCTION) {
    require('dotenv').config();
}

require('./app/app-loader');