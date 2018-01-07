/*
<script src="lib/tether.js"></script>
<script src="lib/shepherd.js"></script>
<script src="lib/bootstrap.js"></script>
*/
require.config({
    baseUrl: "",
    paths: {
		tether:"lib/tether",
		shepherd:"lib/shepherd",
		bootstrap:"lib/bootstrap",
		d3pure:"lib/d3",
		d3:"scripts/d3util",
		uilib:"scripts/uilib",
		radialHist:"scripts/radialHist",
		forceLayout:"scripts/forceLayout",
		dotGraph:"scripts/dotGraph",
		layout:"scripts/layout"
	}
});
require( ["d3", "uilib", "radialHist", "dotGraph", "tether", "forceLayout"], function (d3, uilib, RadialHist, DotGraph, tether, ForceLayout) 
{
	if (!Array.prototype.last){
		Array.prototype.last = function(){
			return this[this.length - 1];
		};
	};
	function randomize(struct){
		var data = [];
		var n = Math.random()*100 + 2;
		for (var i = 0; i < n; i++){
			var row = {};
			for (key in struct){
				row[struct[key]] = Math.random();
			};
			data.push(row);
		}
		return data;
	};
	var charts = [
		{
			name:"DotGraph",
			func:DotGraph,
			struct:{x:"msr1", y:"msr2", r:"msr3"}
		},{
			name:"RadialHist",
			func:RadialHist,
			struct:{r:"value"}
		},{
			name:"ForceLayout",
			func:ForceLayout,
			struct:{r:"value"}
		}
	];
	var body = d3.select("body");
	body.append("button").text("randomize_data").on("click",function(){
		chart.draw(randomize(dataStruct));
	});
	var selectBox = new uilib.selectBox(body, charts.map(function(item){return item.name}), createChart);
	body.append("br");
	var chartDiv = body.append("div");
	var chart;
	var dataStruct;
	function createChart(i){
		chartDiv.selectAll("*").remove();
		dataStruct = charts[i].struct;
		chart = new charts[i].func(chartDiv, {x:0, y:0, w:700, h:500}, dataStruct);
		chart.draw(randomize(dataStruct));
	}
	
	createChart(0);
		  
});