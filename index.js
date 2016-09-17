var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/rad/apigateway',require('./router/gateRouter.js'));
app.use('/download',	function(req,res){
		var path 		= require('path');
		var fs = require('fs');
	var delay=2000; //1 second

			setTimeout(function() {
		
			  	res.download("./api-gateway.zip"); 
			
				
			
			}, delay);
		
	});
app.listen(process.env.PORT ||3000,function () {
	console.log('Server Listening on port 3000');
});

