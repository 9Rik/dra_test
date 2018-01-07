
require.config({
    baseUrl: "static/",
    paths: {
		d3:                 "/static/lib/d3",
		text:               "/static/lib/text",
		moment:             "/static/lib/moment",
		mainLayout:         "/static/scripts/mainLayout",
		reportForm:         "/static/scripts/reportForm",
		qlikEngine:         "/static/scripts/qlikEngine"
        
    }
});

require([
    "d3",
	"mainLayout",
	"reportForm"
], 
function (  
    d3,
	MainLayout,
	ReportForm
){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
	var layout = new MainLayout(d3.select("#main_content"), {x:0, y:0, w:windowWidth, h:windowHeight});
	var reportForm = new ReportForm(layout.mainContainer.div,layout.mainContainer.rect);

    $(window).resize(function(){
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        layout.resize({x:0, y:0, w:windowWidth, h:windowHeight});
    });
   
    
});