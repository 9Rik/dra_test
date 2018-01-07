define(["moment", "text!templates/loadScriptTemplate.qvt"], function (moment, loadScriptTemplate)
{
	const CONNECTION_NAME = "qvdStore";
	const CONNECTION_FOLDER = "D:\\qlik\\qvd";
	
	var connection = {socket:"", promiseChain:""};
	function saveReportForm(reportForm){
		var tasks = [];
		reportForm.tasks.forEach((item) => {
			tasks.push([item.projectName, item.task, item.jiraUrl]);
		});
		var qvdName = "userName."+reportForm.report_type+"."+reportForm.report_dt+".qvd";
		var templateMetadata = {
			REPORT_DT:reportForm.report_dt,
			REPORT_TYPE:reportForm.report_type,
			INLINE_DATA:InlineParser(tasks),
			QVD_PATH:"lib://"+CONNECTION_NAME+"/"+qvdName
		};
		var loadScript = ProcessTemplate(loadScriptTemplate, templateMetadata);
		var app = {
			connection:{
				name:CONNECTION_NAME,
				string:CONNECTION_FOLDER,
				type:"folder"
			},
			script:loadScript
		};
		Connect(connection, "ws://localhost:4848/app");
		var requestQueue = [
			{method:CreateSessionApp, 	params:{}}, 
			{method:GetActiveDoc, 		params:{}}, 
			{method:CreateConnection, 	params:{qName:app.connection.name, qConnectionString:app.connection.string, qType:app.connection.type}}, 
			{method:SetScript, 			params:{qScript:app.script}}, 
			//{method:CheckScriptSyntax, 	params:{}}, 
			{method:DoReload, 			params:{}}
		];
		ExecuteQueue(connection, requestQueue);
		connection.promiseChain.catch((error) => {
			alert("Отчет не сохранен. Ошибка: "+error);
		});
		connection.promiseChain.then(() => alert("Отчет сохранен: " + CONNECTION_FOLDER +"\\"+ qvdName));
	}
	function ProcessTemplate(templateSource, templateMetadata){
		var template = templateSource;
		for (param in templateMetadata) {
			template = template.replace(new RegExp("%"+param+"%","g"),templateMetadata[param]);
		};
		return template;
	}
	function InlineParser(data){
		return data.map((item) => {return item.reduce((prev, curr) => {return prev+", "+curr})}).reduce((prev, curr) => {return prev+"\n"+curr});
	}
	function Connect(connection, url){
		//добавить проверку на ошибки
		connection.promiseChain = new Promise((resolve, reject) => {
			connection.socket = new WebSocket(url);
			connection.socket.onopen = () => {
				console.log("connected: "+url);
				resolve();
			}
		});
	}
	function ExecuteQueue(connection, queue){
		queue.forEach((requestRef, i) => {
			connection.promiseChain = connection.promiseChain.then((response) => {
				if (requestRef.method == undefined) throw Error("method " + requestRef.method.name + " does not exists");
				var request = new requestRef.method();
				request.requestId = i;
				for (param in requestRef.params) {
					if (request[param] == undefined) throw Error("method " + requestRef.method.name + " does not have param " + param);
					request[param] = requestRef.params[param];
				};
				return request.send();
			});
		});
	}
	function QlikRequest(id, handle, method, params, errorCodesToCatch){
		//добавить проверку на ошибки
		var request = {
			jsonrpc: "2.0",
			id: id,
			method: method,
			handle: handle,
			params: params
		};
		function checkErrorCode(errorCode){
			var find = false;
			errorCodesToCatch.forEach((item) => {if (item == errorCode) find = true;})
			return find;
		}
		var promise = new Promise((resolve, reject) => {
			connection.socket.send(JSON.stringify(request));
			connection.socket.onmessage = (reply) => {
				console.log(reply.data);
				var response = JSON.parse(reply.data);
				if (errorCodesToCatch != undefined && response.error != undefined ) {
					if (checkErrorCode(response.error.code)) {
						reject(response.error.message);
					}
				}
				resolve(response);
			};
		});
		return promise;
	}
	function CreateSessionApp (){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, -1, "CreateSessionApp", []);};
	}
	function GetActiveDoc (){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, -1, "GetActiveDoc", []);};
	}
	function CreateConnection(){
		this.requestId = 1;
		this.qName = "";
		this.qConnectionString = "";
		this.qType = "";
		this.send = function(){
			return QlikRequest(this.requestId, 1, "CreateConnection", {
				"qConnection": {
					"qId": "",
					"qName": this.qName,
					"qConnectionString": this.qConnectionString,
					"qType": this.qType,
					"qUserName": "",
					"qPassword": "",
					"qModifiedDate": "",
					"qMeta": {
						"qName": ""
					},
					"qLogOn": 0
				}
			}, [4]);
		}
	}
	function Evaluate (){
		this.requestId = 1;
		this.qExpression = "";
		this.send = function(){return QlikRequest(this.requestId, 1, "Evaluate", [this.qExpression]);};
	}
	function SetScript(){
		this.requestId = 1;
		this.qScript = "";
		this.send = function(){return QlikRequest(this.requestId, 1, "SetScript", [this.qScript]);};
	}
	function CheckScriptSyntax(){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, 1, "CheckScriptSyntax", []);};
	}
	function DoReloadEx(){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, 1, "DoReloadEx", []);};
	}
	function DoReload(){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, 1, "DoReload", []);};
	}
	function GetScript(){
		this.requestId = 1;
		this.send = function(){return QlikRequest(this.requestId, 1, "GetScript", []);};
	}
	/*
	function GetConnections(){
		return QlikRequest(1, socket, 1, "GetConnections", []);
	}
	function GetObject(){
		return QlikRequest(1, socket, 1, "GetObject", [objectName]);
	}
	function GetFullPropertyTree (objectHandle){
		return QlikRequest(1, socket, objectHandle, "GetFullPropertyTree", []);
	}
	function GetDocList(){
		return QlikRequest(1, socket, -1, "GetDocList", []);
	}
	function GetChildInfos (objectHandle){
		return QlikRequest(1, socket, objectHandle, "GetChildInfos", []);
	}
	function OpenApp(){
		return QlikRequest(1, socket, -1, "OpenDoc", [appName, "", "", "", true]);
	}
	function DeleteApp(){
		return QlikRequest(1, socket, -1, "DeleteApp", [appName]);
	}
	function CreateApp(){
		return QlikRequest(1, socket, -1, "CreateApp", [appName]);
	}
	function SaveApp(){
		return QlikRequest(1, socket, 1, "DoSave", []);
	}
	*/
	return {saveReportForm};
});