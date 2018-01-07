define(["d3"], function (d3)
{
	function selectBox(d3Selection, options, callback){
		var select = d3Selection.append("select");
		var join = select.selectAll("option").join(options);
		join.merged().html(function(d){return d});
		select.on("input", function(){
			callback(this.selectedIndex);
		})
		return {select:select, options:options};
	}
	return {selectBox:selectBox};
});