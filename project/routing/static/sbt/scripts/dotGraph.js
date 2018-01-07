define(["d3", "layout"], function (d3, layout)
{
	function chart(d3Selection, rect, struct){
		var svg = d3Selection.append("svg").attr("width", rect.w).attr("height", rect.h);
		var g = svg.append("g");
		function draw(data){
			var minX = d3.min(data, function(d, i){return d[struct.x]});
			var maxX = d3.max(data, function(d, i){return d[struct.x]});
			var minY = d3.min(data, function(d, i){return d[struct.y]});
			var maxY = d3.max(data, function(d, i){return d[struct.y]});
			var minR = d3.min(data, function(d, i){return d[struct.r]});
			var maxR = d3.max(data, function(d, i){return d[struct.r]});
			var rFunc = d3.scaleLinear().domain([minR, maxR]).range([2, 15]);
			var xFunc = d3.scaleLinear().domain([minX, maxX]).range([rect.w*0.1, rect.w*0.9]);
			var yFunc = d3.scaleLinear().domain([minY, maxY]).range([rect.h*0.1, rect.h*0.9]);
						
			var t = g.selectAll("circle").join(data)
			.entered().applyAll({
				attr:{
					cx:function(d, i){return rect.w*0.5},
					cy:function(d, i){return rect.h*0.5},
					r:function(d, i){return rFunc(d[struct.r])}
				},
				style:{
					fill:"blue",
					stroke:"red"
				},
				on:{
					click:function(){}
				}
			})
			.merged().sort(function(a, b){return a[struct.r]<b[struct.r]?1:-1})
			.transition().duration(600)
			.apply("attr", {
				cx:function(d, i){return xFunc(d[struct.x])},
				cy:function(d, i){return yFunc(d[struct.y])},
				r:function(d, i){return rFunc(d[struct.r])}
			});

		}
		return {draw:draw};
	}
	return chart;
});