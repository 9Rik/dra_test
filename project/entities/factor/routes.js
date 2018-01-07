
module.exports = [
    {
        route:'/api/factors', 
        controller:{
            GET:getFactors,
            //PUT:put,
            POST:post
        }
    }
]
const Model = require("./model");

function getFactors(req, res){
    var model_id = req.body.model_id;
    Model.getFactors(model_id).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}
function post(req, res){
    Model.post(req.body).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}