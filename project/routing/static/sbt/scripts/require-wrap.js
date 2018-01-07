
var Require = require;
var Define = define;
require = function (deps, callback, errback, optional){
	var modules = {};
	var root = {};
	Require.onResourceLoad = function (context, map, depMaps) {
		if (isUndefined(modules[map.id]))
				modules[map.id] = {name:map.id, deps:{}};
		for (var i = 0; i < depMaps.length; i++){
			modules[map.id].deps[depMaps[i].id] = "";
		}
	};
	Require(deps, callbackWrap, errback, optional);
	
	function callbackWrap(){
		for (var i = 0; i < deps.length; i++){
			root[deps[i]] = modules[deps[i]];
		}
		callback.apply({}, arguments);
	}
	require.getDepTree = function(){
		var nodes = [{index:0, name:"root"}];
		var links = [];
		var map = {};
		for (m in modules){
			map[m] = nodes.length;
			nodes.push(modules[m]);
			nodes[nodes.length-1].index = nodes.length-1;
		}
		for (m in modules){
			var deps = modules[m].deps;
			for (d in deps){
				if (map[m] && map[d])
				links.push({source:map[m], target:map[d]});
			}
		}
		for (r in root){
			links.push({source:0, target:map[r]});
		}
		return {nodes:nodes, links:links}
	}
}
define = function (){
	var args = [];
	var callback;
	for (var i = 0; i < arguments.length; i++){
		if (isFunction(arguments[i])){
			callback = arguments[i];
			args.push(callbackWrap);
		}
		else{
			args.push(arguments[i]);
		}
	}
	Define.apply(null, args);
	function callbackWrap(){
		return callback.apply({}, arguments);
	}
}
for (param in Require){
	require[param] = Require[param];
}
for (param in Define){
	define[param] = Define[param];
}
require.config = function(config){
	Require.config(config);
}
requirejs = require;
function isFunction(it) {
	return it instanceof Function;
}
function isArray(it) {
	return it instanceof Array;
}
function isUndefined(it) {
	return typeof it == "undefined";
}
