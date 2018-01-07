
module.exports = [
    {
        route:'/api/genStat/', 
        controller:{
            POST:genStat
        }
    }
]
const Model = require("./model");

function genStat(req, res){
    var model_id = req.body.model_id;
    var model = new Model.riskModel(model_id);
}