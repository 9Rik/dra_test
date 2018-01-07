



var Model = require("../model/model");
var Factor = require("../factor/model");
var Link = require("../factor/model");

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