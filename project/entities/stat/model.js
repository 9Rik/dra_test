

const mongoose = require("../mongo");

var Schema = new mongoose.Schema({
    model_id: { type: String },
    created_at: { type: Date },
    data: { type: Object }
});

var Stat = mongoose.model('Stat', Schema);

var Model = require("../model/model");

module.exports.instance = Stat;
module.exports.post = post;
module.exports.getStats = getStats;

function post(stat){
    return new Promise((resolve, reject) => {
        var queue = [];
        queue.push(Model.instance.findById(stat.model_id).exec());
        
        Promise.all(queue).then((data) => {
            if (data[0] == null){
                reject("model_id " + stat.model_id + " does not exist")
                return;
            }
            
            Stat.create(stat, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        }).catch(reject);
    });
}

function getStats(model_id){
    return Stat.find({model_id: model_id}).exec();
}