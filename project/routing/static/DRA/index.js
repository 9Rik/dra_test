
require.config({
    baseUrl: "static/DRA",
    paths: {
		d3:     "/static/lib/d3",
		text:   "/static/lib/text",
		moment: "/static/lib/moment"
        
    }
});

require([
    "d3",
    "scripts/draApi"
], 
function (  
    d3,
    draApi
){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    var model = new TestModel;
    model.randomize();
    model.on("ready", function(){
        debugger;   
    })
    
    function TestModel(){
        var dispatch = d3.dispatch("ready");
        var model = this;
        
        this.on = dispatch.on.bind(dispatch);
        this.randomize = function(){
            draApi.request("POST", "/api/models/", {}).then(function(data){
                model = data;
                return createFactors(model).then(function(data){
                    var factors = data;
                    var matrix = [];
                    for (var i = 0; i < factors.length; i++){
                        matrix.push([]);
                        for (var j = 0; j < factors.length; j++){
                            matrix[i].push(0);
                        }
                    }
                    for (var j = 0; j < factors.length; j++){
                        var N = factors.length*Math.random();
                        for (var k = 0; k < N; k++){
                            var i = Math.ceil(Math.random()*(factors.length - 1));
                            matrix[i][j] = 1;
                        }
                    }
                    model.factors = factors;
                    model.matrix = matrix;
                    return createLinks(model);
                    
                })
            })
            .then(function(data){
                model.links = data
                dispatch.call("ready", model);
            })
            .catch(function(e) {debugger;});
        }
        function createFactors(model){
            var queue = [];
            var N = 15*Math.random() + 10;
            for (var k = 0; k < N; k++){
                queue.push(draApi.request("POST", "/api/factors/", {model_id:model._id}));
            }
            return Promise.all(queue);
        };
        function createLinks(model){
            var queue = [];
            model.matrix.forEach(function(row, i){
                row.forEach(function(cell, j){
                    if (cell == 0) return;
                    var from_factor_id = model.factors[i]._id;
                    var to_factor_id = model.factors[j]._id;
                    queue.push(draApi.request("POST", "/api/links/", {
                        model_id:model._id,
                        from_factor_id:from_factor_id,
                        to_factor_id:to_factor_id,
                        data:{
                            dirh:Math.random()*100
                        }
                    }));
                })
            })
            return Promise.all(queue);
        };
    }
    $(window).resize(function(){
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        
    });
   
    
});