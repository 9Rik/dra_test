

const mongoose = require("../mongo");


var Schema = new mongoose.Schema({
    login: String,
    created_at: Date,
    updated_at: Date,
    session_id: String,
    last_request: Date ,
    data: { type: Object }
});

var User = mongoose.model('User', Schema);

var currentUser;

module.exports.instance = User;
module.exports.find = findUser;
module.exports.create = createUser;
module.exports.auth = authUser;
module.exports.getCurrentUser = function () { return currentUser };

function findUser(login){
    return User.find({login: login}).exec();
}
function createUser(login, session_id){
    return new Promise((resolve, reject) => {
        User.create({
        login: login,
        created_at: Date.now(),
        updated_at: Date.now(),
        session_id: session_id,
        last_request: Date.now()
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
function authUser(login, session_id){
    return User.update({
        login: login
    },{
        session_id: session_id,
        last_request: Date.now()
    }).exec().then(() => findUser(login)).then((data) => { currentUser = data[0] });
}
