define(["d3", "moment", "qlikEngine"], function (d3, moment, qlikEngine)
{
    return function reportForm(d3Selection, _rect){ 
	
        var reportForm = {report_type:"week", report_dt:getReportDate("week"), tasks:[]};
		
        var taskTable = d3Selection.append("table").attr("border", "1").style("width", "70%").style("position", "absolute").style("left", "5%");
		var tableHead = taskTable.append("thead");
		var tableBody = taskTable.append("tbody");
		drawTableHead();
		drawTableBody();
		
		function drawTableHead(){
			var tr1 = tableHead.append("tr");
			var select = tr1.append("td").append("select");
			joinDomWithData(select, ["week", "month"], "option", "option").allNodes().html((d, i) => {return d});
			select.on("input", selectReportType);
			tr1.append("td").attr("id", "report_dt").attr("colspan", "2").html("Отчетная дата: "+reportForm.report_dt);
			tr1.append("td").attr("colspan", "2").append("button").html("Сохранить в QVD").on("click", saveReportForm);
			var tr2 = tableHead.append("tr");
			tr2.append("td").style("width", "5%").html("№");
			tr2.append("td").style("width", "20%").html("Проект");
			tr2.append("td").style("width", "35%").html("Задача");
			tr2.append("td").style("width", "30%").html("Jira");
			tr2.append("td").style("width", "10%").append("button").html("Добавить").on("click", addTask);
		}
		function saveReportForm(){
			if (reportForm.tasks.length == 0) alert("Нет задач для сохранения");
			else qlikEngine.saveReportForm(reportForm);
		}
		function selectReportType(){
			reportForm.report_type = this.selectedOptions[0].value;
			reportForm.report_dt = getReportDate(reportForm.report_type);
			tableHead.select("#report_dt").html("Отчетная дата: "+reportForm.report_dt);
		}
		function addTask(){
			reportForm.tasks.push({projectName:"Название проекта", task:"Название задачи", jiraUrl:"Ссылка на Jira"});
			drawTableBody();
		};
		function deleteTask(d, i){
			reportForm.tasks = reportForm.tasks.reduce((prev, curr, j)=>{
				if (i!=j) prev.push(curr);
				return prev;
			}, []);
			drawTableBody();
		};
		function drawTableBody(){
			var join = joinDomWithData(tableBody, reportForm.tasks, "tr", "tr");
			var newRows = join.newNodes();
			var allRows = join.allNodes();
			buildRows(newRows);
			updateRows(allRows);
			tableBody.selectAll("input").style("width", "90%").style("position", "relative").style("left", "0%");
		}
		function buildRows(rows){
			rows.append("td").attr("id", "cell0");
			rows.append("td").append("input").attr("id", "cell1").on("input", (d, i) => {reportForm.tasks[i].projectName = d3.event.srcElement.value;});
			rows.append("td").append("input").attr("id", "cell2").on("input", (d, i) => {reportForm.tasks[i].task = d3.event.srcElement.value;});
			rows.append("td").append("input").attr("id", "cell3").on("input", (d, i) => {reportForm.tasks[i].jiraUrl = d3.event.srcElement.value;});
			rows.append("td").append("button").html("Удалить").on("click", deleteTask);
		}
		function updateRows(rows){
			rows.select("#cell0").html((d, i) => {return i+1});
			rows.select("#cell1").attr("value", (d, i) => {return d.projectName});
			rows.select("#cell2").attr("value", (d, i) => {return d.task});
			rows.select("#cell3").attr("value", (d, i) => {return d.jiraUrl});
		}
		function joinDomWithData(domParent, data, selector, domElement){
			var join = domParent.selectAll(selector).data(data);
			join.exit().remove();
			var append = join.enter().append(domElement);
			function newNodes(){return append};
			function allNodes(){return domParent.selectAll(selector)};
			return {newNodes, allNodes}
		}
		function getReportDate(report_type){
			var report_dt;
			if (report_type == "week") {
				var nextMonday = 1 < moment().weekday() ? moment().weekday(1 + 7) : moment().weekday(1);
				report_dt = nextMonday.format("DD.MM.YYYY");
			}
			else {
				var firstMonday = moment().startOf('month').startOf('isoweek');
				if (firstMonday.month() != moment().month()) firstMonday.add(7,'d');
				if (firstMonday.date() < moment().date()) firstMonday = firstMonday.add(1, 'months').startOf('isoweek');
				report_dt = firstMonday.format("DD.MM.YYYY");
			}
			return report_dt;
		}
		return {};
	}
});