var express = require('express')
var router = express.Router()

const User = require("../../entities/user/model");
const Model = require("../../entities/model/model");
const Factor = require("../../entities/factor/model");
const Link = require("../../entities/link/model");

/*model*/
router.get('/', function (req, res) {
   var user = User.getCurrentUser();
    Model.getModelsCreatedBy(user.login).then((data) => {
        res.response(data);
    }).catch((e) => res.error(e))
})

router.all('/:modelId/', function(req, res, next){
    var modelId = req.params.modelId;
    Model.mongo.findById(modelId).exec().then((data) => {
        if (data){
            next();
        }
        else{
            res.send({error:"model " + modelId + " does not exist!"})
        }
    }).catch((e) => res.error(e))
})
router.delete('/:modelId', function(req, res, next){
    var modelId = req.params.modelId;
    var queue = [];
    queue.push(Model.mongo.findByIdAndRemove(modelId).exec());
    queue.push(Factor.mongo.remove({model_id:modelId}).exec());
    queue.push(Link.mongo.remove({model_id:modelId}).exec());
    Promise.all(queue)
    .then((data) => {
        var errors = [];
        var logs = [];
        if (data[0] == null) errors.push('This is Sparta and model does not exist!');
        if (data[1].result.n == 0) logs.push('Model have not factors!');
        if (data[2].result.n == 0) logs.push('Model have not links!');
        if (errors.length) res.error(errors + logs);
        else res.response('Model was removed! '+ logs);
    }).catch((e) => res.error(e));
})

/*factor*/
router.get('/:modelId/factors', function(req, res, next){
    var modelId = req.params.modelId;
    Factor.getFactors(modelId).then((data) => {
        res.response(data);
    }).catch((e) => res.error(e))
})
router.post('/:modelId/factors', function(req, res, next){
    var factor = {
        model_id:req.params.modelId,
        data:req.body
    };
    Factor.mongo.create(factor, (err, data) => {
        if (err) res.error(err);
        else res.response(data);
    });
});
router.delete('/:modelId/factors/:factorId', function(req, res, next){
    var model_id = req.params.modelId;
    var factor_id = req.params.factorId;
    
    var queue = [];
    
    queue.push(Factor.mongo.findById(factor_id).exec());
    queue.push(Link.mongo.find({$or:[{model_id: model_id, from_factor_id: factor_id}, {model_id: model_id, to_factor_id: factor_id} ]}).exec());
    
    Promise.all(queue)
    .then((data) => {
        var log = [];
        var actions = [];
        if (data[0] == null) res.error('Factor does not exist');
        else actions.push(Factor.mongo.findByIdAndRemove(factor_id).exec());
        if (data[1].length == 0) log.push('Factor have not links');
        else actions.push(Link.mongo.remove({$or:[{model_id: model_id, from_factor_id: factor_id}, {model_id: model_id, to_factor_id: factor_id} ]}).exec());
        if (actions){
            Promise.all(actions)
            .then((data) => {
                if (data) res.response(log + data);
                else debugger;
            }).catch((e) => res.error(e));
        }
    }).catch((e) => res.error(e));   
});

/*link*/
router.get('/:modelId/links', function(req, res, next){
    var modelId = req.params.modelId;
    Link.getLinks(modelId).then((data) => {
        res.response(data);
    }).catch((e) => res.error(e))
})

router.post('/:modelId/links', function(req, res, next){
    var link = {
        model_id:req.params.modelId,
        from_factor_id:req.body.from_factor_id,
        to_factor_id:req.body.to_factor_id
    };
    var queue = [];
    queue.push(Model.mongo.findById(link.model_id).exec());
    queue.push(Factor.mongo.findById(link.from_factor_id).exec());
    queue.push(Factor.mongo.findById(link.to_factor_id).exec());
    queue.push(Link.mongo.find({
        model_id: link.model_id,
        from_factor_id:link.from_factor_id,
        to_factor_id:link.to_factor_id
    }).exec());
    
    Promise.all(queue)
    .then((data) => {
        var errors = [];
        if (data[0] == null) errors.push("model_id " + link.model_id + " does not exist");
        if (data[1] == null) errors.push("from_factor_id " + link.from_factor_id + " does not exist")
        if (data[2] == null) errors.push("to_factor_id " + link.to_factor_id + " does not exist")
        if (data[3].length) errors.push("link in model " + link.model_id + " from factor " + link.from_factor_id + " to factor "+ link.to_factor_id +" already exists")
        if (errors.length) res.send({error:errors});
        else{
            Link.create(link, (err, data) => {
                if (err) res.error(err);
                else res.response(data);
            });
        }
    }).catch((e) => res.error(e));
});

router.delete('/:modelId/links/:linkId', function(req, res, next){ 
    Link.mongo.findByIdAndRemove(req.params.linkId).exec()
    .then((data) => {
        if (data) res.response(data)
        else res.error('Link does not exist');
    }).catch((e) => res.error(e));
});

module.exports = router;