const mongoose = require("../mongo");

var Schema = new mongoose.Schema({
    model_id: { type: String },
    data: { type: Object }
});

var Factor = mongoose.model('Factor', Schema);

var Model = require("../model/model");

module.exports.mongo = Factor;
module.exports.getFactors = getFactors;
module.exports.post = post;
function post(factor){
    return new Promise((resolve, reject) => {
        if (factor.model_id == undefined) reject("model_id is undefined");
        Model.mongo.findById(factor.model_id).exec().then((data) => {
            if (data){
                Factor.create(factor, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            }
            else{
                reject("model " + model_id + " does not exist")
            }
        }).catch(reject)
    });
}

function getFactors(model_id){
    return Factor.find({model_id: model_id}).exec();
}