

const mongoose = require("../mongo");


var Schema = new mongoose.Schema({
    created_by: String,
    created_at: Date,
    updated_by: String,
    updated_at: Date
});

var Model = mongoose.model('Model', Schema);

module.exports.mongo = Model;
module.exports.findById = findById;
module.exports.post = post;
module.exports.getModelsCreatedBy = getModelsCreatedBy;

function findById(id){
    return Model.findById(id).exec();
}
function post(login){
    return new Promise((resolve, reject) => {
        Model.create({
            created_by: login,
            created_at: Date.now(),
            updated_by: login,
            updated_at: Date.now()
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
function update(login, session_id){
    return Model.update({
        login: login
    },{
        session_id: session_id,
        last_request: Date.now()
    }).exec();
}

function getModelsCreatedBy(login){
    return Model.find({created_by: login}).exec();
}