define(["d3"], function (d3)
{
    return function mainLayout(d3Selection, _rect){
		
		var layoutRect = _rect;
		var blocks = [{}, {}, {}];
        blocks[0].div=d3Selection.append('div')
            .style("background-color", "#e8e8e8");  
			
        blocks[1].div=d3Selection.append('div')
            .style("background-color", "#828282");	
			
        blocks[2].div=d3Selection.append('div')
            .style("background-color", "#e8e8e8");   
        
        resize(layoutRect);
		
		function resize(_rect){
			layoutRect = _rect;
			d3Selection.style("position", "absolute")
				.style("left",layoutRect.x+"px")
				.style("top", layoutRect.y+"px")
				.style("width", layoutRect.w+"px")
				.style("height", layoutRect.h+"px");
			resizeBlocks();
		}
		
		function resizeBlocks(){
			var menuW = 50;
			var headerH = 50;

			blocks[0].rect = {x:menuW,			y:0,			w:layoutRect.w-menuW,	h:headerH};
            blocks[1].rect = {x:0,				y:0,			w:menuW,				h:layoutRect.h};
			blocks[2].rect = {x:menuW,			y:headerH,		w:layoutRect.w-menuW,	h:layoutRect.h-headerH};
            blocks.forEach(function(item){
                item.div.style("position", "absolute")
                    .style("left", item.rect.x+"px")
                    .style("top", item.rect.y+"px")
                    .style("width", item.rect.w+"px")
                    .style("height", item.rect.h+"px");
            });
        }
        blocks[0].div.style("display", "flex");
		blocks[0].div.append("span")
			.style("margin", "1%")
			.style("font-size", "200%")
			.html("Статус ЦК BI");

		return {
			header:blocks[0],
			menu:blocks[1],
			mainContainer:blocks[2],
			resize:resize
		};
		
	}
});