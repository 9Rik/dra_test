
module.exports = [
    {
        route:'/api/models/', 
        controller:{
            GET:getCurrentUserModels,
            POST:post
        }
    }
]
const Model = require("./model");
const User = require("../user/model");

function getCurrentUserModels(req, res){
    var user = User.getCurrentUser();
    Model.getModelsCreatedBy(user.login).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}
function post(req, res, next){
    var user = User.getCurrentUser();
    Model.post(user.login).then((data) => {
        res.send({response:data});
    }).catch((e) => res.send({error:e}))
}