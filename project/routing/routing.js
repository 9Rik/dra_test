
const mime = require('mime');
const fs = require('fs-extra');
const log = require('winston');
const path = require('path');
//добавить автоматическое подхватывание всех файликов routes
const modelRoutes = require("../entities/model/routes");
const factorRoutes = require("../entities/factor/routes");
const linkRoutes = require("../entities/link/routes");
const riskRoutes = require("../entities/risk/routes");


function initRoutes(app){
    var routes = [
        {route:'/', controller:{ GET:sendIndex } },
        {route:'/static/*', controller:{ GET:sendStatic } }
    ];
    routes = routes.concat(modelRoutes).concat(factorRoutes).concat(linkRoutes).concat(riskRoutes);
    routes.forEach((d, i) => app.use(d.route, (req, res, next) => {
        if (req.url != "/") {
            next();
            return;
        }
        if (d.controller[req.method]){
            d.controller[req.method](req, res, next);
        }
        else {
            res.send("method " + req.method + " not found");
        }
    }));
    app.use('/models', require('./dynamic/models'));
}
function sendFile(filePath, res){
    fs.readFile(filePath, (error, content) =>{
        if (error) {
            res.status(404);
            res.send("resourse not found");
        }
        else{
            mimeType = mime.lookup(filePath);
            res.setHeader('Content-Type', mimeType+';charset=utf-8');
            res.send(content);
        }
    });
}
function sendIndex(req, res){
    sendFile(path.join(__dirname, "/static/DRA/index.html"), res);
}
function sendStatic(req, res){
    sendFile(__dirname + "/./" +req.baseUrl, res);
}
module.exports.initRoutes = initRoutes;