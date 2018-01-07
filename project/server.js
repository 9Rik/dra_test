const express = require('express');
const nodeSSPI = require('node-sspi');
const moment = require('moment');
const nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
})
const routing = require('./routing/routing');
const userApi = require('./entities/user/api');

const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(sspiAuth);
app.use(userApi.auth);
app.use(logger);
app.listen(1337, function(){
	console.log('Express server listening on port 1337');
});

routing.initRoutes(app);

function sspiAuth(req, res, next) {
    nodeSSPIObj.authenticate(req, res, function(err){
        res.finished || next()
    })
}

function logger(req, res, next){
    res.error = (e) => res.send({error:e});
    res.response = (data) => res.send({response:data});
    var msg = {
        dt:moment().format('DD.MM.YYYY HH.mm.ss'),
        user:req.connection.user,
        origin:req.originalUrl,
        params:req.params,
        query:req.query
    };
    console.log(JSON.stringify(msg, null, 4));
    next();
}