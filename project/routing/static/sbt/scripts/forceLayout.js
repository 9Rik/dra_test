define(["d3", "layout"], function (d3, layout)
{
	function chart(d3Selection, rect, struct){
		var svg = d3Selection.append("svg").attr("width", rect.w).attr("height", rect.h);
		var gLines = svg.append("g");
		var gCircles = svg.append("g");
		function draw(data){
			var tree = require.getDepTree();
			var nodes = tree.nodes;
			nodes.forEach(function(item){item.r = 20});
			var links = tree.links;

			var simulation = d3.forceSimulation(nodes)
				.force("charge", d3.forceManyBody())
				.force("link", d3.forceLink(links).distance(100).strength(1))
				.force("collide", d3.forceCollide().radius(function(d) { return d.r*2; }).iterations(2))
				//.force("x", d3.forceX())
				//.force("y", d3.forceY())
				.on("tick", ticked);


			svg.call(d3.drag()
					.container(svg)
					.subject(dragsubject)
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended));
			function checkRect(node){
				if (node.x < 50){
					node.x = 50;
					node.vx = 0;
				}
				if (node.x > rect.w - 50){
					node.x = rect.w - 50;
					node.vx = 0;
				}
				if (node.y < 20){
					node.y = 20;
					node.vy = 0;
				}
				if (node.y > rect.h - 20){
					node.y = rect.h - 20;
					node.vy = 0;
				}
			}
			function ticked() {
				nodes.forEach(function(node){
					checkRect(node);
				})
				gCircles.selectAll("circle").join(nodes)
				.entered().applyAll({
					attr:{
						cx:function(d, i){d.x = rect.w*0.5; return d.x},
						cy:function(d, i){d.y = rect.h*0.5; return d.y},
						r:function(d, i){return d.r}
					},
					style:{
						"fill":"white",
						"fill-opacity":"0"
						//stroke:"white"
					}
				})
				.merged().applyAll({
					attr:{
						cx:function(d, i){return d.x},
						cy:function(d, i){return d.y}
					}
				});
				gCircles.selectAll("rect").join(nodes)
				.merged().applyAll({
					attr:{
						x:function(d, i){return d.x - 50},
						y:function(d, i){return d.y - 10},
						width:function(d, i){return 100},
						height:function(d, i){return 20}
					},
					style:{
						"fill":"white",
						"text-anchor":"middle",
						//"fill-opacity":"0",
						stroke:"black"
					}
				});
				gCircles.selectAll("text").join(nodes)
				.merged().applyAll({
					attr:{
						x:function(d, i){return d.x},
						y:function(d, i){return d.y +3.5}
					},
					style:{
						"fill":"black",
						"text-anchor":"middle"
						//"fill-opacity":"0",
						//stroke:"black"
					}
				}).text(function(d, i){ return d.name});
				gLines.selectAll("line").join(links)
				.merged().applyAll({
					attr:{
						x1:function(d, i){return d.source.x},
						y1:function(d, i){return d.source.y},
						x2:function(d, i){return d.target.x},
						y2:function(d, i){return d.target.y},
					},
					style:{
						fill:"black",
						stroke:"black"
					}
				});
			}

			function dragsubject() {
				return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
			}

			function dragstarted() {
			  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			  d3.event.subject.fx = d3.event.subject.x;
			  d3.event.subject.fy = d3.event.subject.y;
			}

			function dragged() {
			  d3.event.subject.fx = d3.event.x;
			  d3.event.subject.fy = d3.event.y;
			}

			function dragended() {
			  if (!d3.event.active) simulation.alphaTarget(0);
			  d3.event.subject.fx = null;
			  d3.event.subject.fy = null;
			}

		}
		return {draw:draw};
	}
	return chart;
});