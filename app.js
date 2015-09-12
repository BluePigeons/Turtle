var express = require('express');

var app = express();

app.get('/', function(req,res){
   //res.send("Hello World!"); //respond with string
   res.sendFile(__dirname+'/index.html'); //respond with file

});

app.get('/help', function(req, res){
    res.sendFile(__dirname+'/help.html');
});

app.listen(3000, function(){
	console.log("Running! Yay!");
});

