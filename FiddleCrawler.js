// to run this code use phantomjs fetchData.js
var counter=-1;
var url = [];
var startRender;
var page;
var rootDirectoryName = "fiddles";
var newFiddleObjects = [];

page = require('webpage').create();
startRender = (function() {
	counter += 1;
	if(counter >= url.length) {
		phantom.exit();
	}
	
	if(counter>newFiddleObjects.length) {
		counter -= 1;
	}
	console.log("****** "+counter+" "+url[counter].fiddle_url+" *****");
	page.open(url[counter].fiddle_url, function(status) {
		if(status=='success') {
			createLocalFiles();
		} else {
			console.log("Error ocurs");
		}
	});	
});
var createLocalFiles = (function() {
	
        if(page.injectJs('jquery.js')) {
            var fs = require('fs');
            var value = page.evaluate(function() {
			    var html = $('#id_code_html').text();
			    var js   = $('#id_code_js').text();
			    var css  = $('#id_code_css').text();
			    var resources = [];
			    $("a.filename").each(function() {
			    	resources.push($(this).attr('href'));
			    });	
			    var options = {};
			    options.description = $('#id_description').text();
			    options.title = $("#id_title").val();
			    return {html:html, js:js, css:css, resources:resources, options:options};
			});
            
			folderName = counter;
			fs.makeDirectory(folderName);
	
			fs.write(folderName + "/" + "demo.html", value.html, 'w'); 
			fs.write(folderName + "/" + "demo.css", value.css, 'w'); 
			fs.write(folderName + "/" + "demo.js", value.js, 'w'); 
			
			var detailsContent = "---\nname: "+value.options.title+"\ndescription: "+value.options.description+"\nresources: \n";
			for(var index in value.resources) {
				detailsContent += '  - '+value.resources[index]+'\n';
			}
			detailsContent += '...';
			fs.write(folderName+"/"+"demo.details", detailsContent, 'w');  	
					
			console.log("****file write done****");
        }
});


setInterval(function(){
	startRender();	
},60000);
