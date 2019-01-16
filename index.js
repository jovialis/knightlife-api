global.__basedir = __dirname;

if (!process.env.PRODUCTION) {
    console.log('Starting in local development mode.');
    
    require('dotenv').config();
}

require('./app/app-loader');