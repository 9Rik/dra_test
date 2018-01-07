

const mongoose = require("../mongo");

var Schema = new mongoose.Schema({
    model_id: { type: String },
    from_factor_id: { type: String },
    to_factor_id: { type: String },
    data: { type: Object }
});

var Link = mongoose.model('Link', Schema);

var Model = require("../model/model");
var Factor = require("../factor/model");

module.exports.mongo = Link;
module.exports.post = post;
module.exports.getLinks = getLinks;

function post(link){
    return new Promise((resolve, reject) => {
        var queue = [];
        queue.push(Model.mongo.findById(link.model_id).exec());
        queue.push(Factor.mongo.findById(link.from_factor_id).exec());
        queue.push(Factor.mongo.findById(link.to_factor_id).exec());
        queue.push(Link.find({
            model_id: link.model_id,
            from_factor_id:link.from_factor_id,
            to_factor_id:link.to_factor_id
        }).exec());
        
        Promise.all(queue).then((data) => {
            if (data[0] == null){
                reject("model_id " + link.model_id + " does not exist")
                return;
            }
            if (data[1] == null){
                reject("from_factor_id " + link.from_factor_id + " does not exist")
                return;
            }
            if (data[2] == null){
                reject("to_factor_id " + link.to_factor_id + " does not exist")
                return;
            }
            if (data[3].length != 0){
                reject("link in model " + link.model_id + " from factor " + link.from_factor_id + " to factor "+ link.to_factor_id +" already exists")
                return;
            }
            Link.create(link, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        }).catch(reject);
    });
}

function getLinks(model_id){
    return Link.find({model_id: model_id}).exec();
}