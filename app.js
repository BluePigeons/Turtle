var express = require('express');

var app = express();

var mongoose = require('mongoose');

mongoose.connect('mongodb://sven:octopus@ds053469.mongolab.com:53469/turtl');

    var userSchema = mongoose.Schema({
        user: { type: String, unique: true },
        wellbeing: String
    });
    var User = mongoose.model('User', userSchema);

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {


});

 
app.get('/', function(req,res){
   //res.send("Hello World!"); //respond with string
   //res.sendFile(__dirname+'/index.html'); //respond with file
   console.log(req.query.user+" is "+req.query.wellbeing);
   
   var user = new User({user: req.query.user,
        wellbeing: req.query.wellbeing});
   user.save(function(err, user) {
  if (err) return console.error(err);
  console.dir(user);
});
 res.send(req.query.user+" is "+req.query.wellbeing);
   
});

app.get('/help', function(req, res){
    res.sendFile(__dirname+'/help.html');
});

app.listen(3000, function(){
	console.log("Running! Yay!");
});

