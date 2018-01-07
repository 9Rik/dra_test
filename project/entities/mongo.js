const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var uri = "mongodb://localhost/DRA";
var options = {
    useMongoClient: true,
    reconnectTries: Number.MAX_VALUE, 
    reconnectInterval: 500 
};
mongoose.connect(uri, options);

module.exports = mongoose;
