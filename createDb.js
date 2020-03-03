let async = require('async');
let mongoose = require('./libs/mongoose');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUser
],function (err,results) {
console.log(arguments);
mongoose.disconnect();
process.exit(err ? 255:0);
});


function open(callback){
    mongoose.connection.on('open',callback);
}
function dropDatabase(callback){
    let db =mongoose.connection.db;
    db.dropDatabase(callback);
}
function requireModels(callback) {
    require('./models/users.js');
    async.each(Object.keys(mongoose.models),function (modelName,callback) {
        mongoose.models[modelName].ensureIndexes(callback);

    },callback);
}
function createUser(callback){


    let ships=[
        {username:'15',password:'111'},
        {username:'4',password:'112'},
        {username:'14',password:'113'}
    ];
    async.each(ships,function (userData,callback) {
    let user = new mongoose.models.User(userData);
    user.save(callback);
    },callback);
}



