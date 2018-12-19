const connection = require("mongoose");
connection.connect(process.env.MONGODB_URI);
module.exports = connection;

require('./models/vacation');