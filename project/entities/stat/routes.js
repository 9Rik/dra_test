
module.exports = [
    {
        route:'/api/links', 
        controller:{
            GET:getLinks,
            POST:post
        }
    }
]
const Model = require("./model");

function getLinks(req, res){
    var model_id = req.params.model_id;
    Model.getLinks(model_id).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}
function post(req, res){
    Model.post(req.body).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}