
module.exports.riskModel = riskModel;

var Model = require("../model/model");
var Factor = require("../factor/model");
var Link = require("../link/model");

function riskModel(model_id){
    var model = this;
    model.factors = {array:[], map:{}};
    model.links = {array:[], map:{}};
    model.matrix = {r:[], w:[]};
    var queue = [
        Factor.mongo.find({model_id:model_id}).exec(),
        Link.mongo.find({model_id:model_id}).exec()
    ];
    Promise.all(queue).then((data) => {
        model.factors.array = data[0].map((d, i) => { return {  
            id:d._id, 
            inputs:{array:[], map:{}}
        }});
        model.links.array = data[1].map((d, i) => { return { 
            id:d._id, 
            from_factor_id:d.from_factor_id,
            to_factor_id:d.to_factor_id,
            dirh:d.data.dirh
        }});
        model.factors.array.forEach((d, i) => {
            model.factors.map[d.id] = i;
            model.matrix.r.push([]);
            model.matrix.w.push([]);
            model.factors.array.forEach((d, j) => {
                model.matrix.r[i].push(0);
            });
        });
        model.links.array.forEach((d, k) => {
            var i = model.factors.map[d.from_factor_id];
            var j = model.factors.map[d.to_factor_id];
            model.factors.array[j].inputs.array.push({ 
                id:d.from_factor_id,
                dirh:d.dirh
            });
            model.matrix.r[i][j] = 1;
        });
        model.factors.array.forEach(function(d, i){
            d.inputs.array.forEach(d, i){
                d.w = Math.random();
            }
        });
        model.factors.array.forEach(function(factor, i){
            d.inputs.array.forEach(input, i){
                var j = model.factors.map[factor.id];
                var i = model.factors.map[input.id];
                model.matrix.w[i][j] = input.w;
            }
        });
    })
}


