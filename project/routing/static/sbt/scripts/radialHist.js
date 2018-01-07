define(["d3", "dotGraph"], function (d3, dotGraph)
{
	function chart(d3Selection, rect, struct){
		var svg = d3Selection.append("svg").attr("width", rect.w).attr("height", rect.h);
		var g = svg.append("g").attr("transform", "translate("+rect.w*0.5+" "+rect.h*0.5+")");
		function draw(data, sort){
			if (sort)
				data.sort(function(a, b){return a[struct.r]>b[struct.r]?1:-1});
			var min = d3.min(data, function(d, i){return d[struct.r]});
			var max = d3.max(data, function(d, i){return d[struct.r]});
			
			var rMin = rect.w*0.1;
			var rFunc = d3.scaleLinear().domain([min, max]).range([rect.w*0.15, rect.w*0.3]);
			var aFunc = d3.scaleLinear().domain([0, data.length]).range([0, Math.PI*2]);
			var arc = d3.arc()
				.innerRadius(rMin)
				.outerRadius(function(d, i){return rFunc(d[struct.r])})
				.startAngle(function(d, i){return aFunc(i)})
				.endAngle(function(d, i){return aFunc(i+1)});
			var spawnArc = d3.arc()
				.innerRadius(rMin)
				.outerRadius(function(d, i){return rFunc(min)})
				.startAngle(function(d, i){return aFunc(i)})
				.endAngle(function(d, i){return aFunc(i+1)});
			
			var join = g.selectAll("path").join(data);
			join.entered()
			.applyAll({
				attr:{d:spawnArc},
				style:{
					fill:"blue",
					stroke:"red"
				}
			});
			join.merged().transition().duration(600).attr("d", arc);
		}
		return {draw:draw};
	}
	return chart;
});