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

 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/sup', function(req,res){
   //res.send("Hello World!"); //respond with string
   //res.sendFile(__dirname+'/index.html'); //respond with file
   console.log(req.query.user+" is "+req.query.wellbeing);
   console.log("=================");
   console.log(db);
   console.log("=================");
   var thisUser = db.collections.users.findOne({user: req.query.user}, function (err, doc) {
   	    if(doc){
   	     	/*
   		doc.wellbeing = req.query.wellbeing;
   		console.log(doc);
   		console.log("=================");
    doc.save(function(err, user) {
        if (err) return console.error(err);
           console.log("=================");
           console.dir(user);
           console.log("=================");
    });*/

            User.update({ user : doc.user }, { $set: { wellbeing : req.query.wellbeing }}, function(err, doc){});
   }
   else{
   	var user = new User({user: req.query.user,
        wellbeing: req.query.wellbeing});
    user.save(function(err, user) {
    if (err) return console.error(err);
    console.dir(user);
   });
   }
   
 res.send(req.query.user+" is "+req.query.wellbeing);
   });

   
});

app.get('/help', function(req, res){
    res.sendFile(__dirname+'/help.html');
});

app.listen(3000, function(){
	console.log("Running! Yay!");
});



//Braintree stuff


var braintree = require("braintree");


app.get('/', function (req, res) {
    gateway.clientToken.generate({}, function (error, response) {
      var clientToken = response.clientToken;
      res.render('index', { clientToken: clientToken });
    });
});

app.get('/logged', function (req, res) {
    res.render('logged');
});

app.get('/payment', function (req, res) {
    console.log('get payment');
    res.render('payment');
});

app.get('/welcome', function (req, res) {
    res.render('welcome');
});

app.get('/braintree', function (req, res){
    res.render('braintree');
});

app.post('/checkout', function (req, res){
   console.log(req);
    var nonce = req.body.payment_method_nonce;
    
    gateway.transaction.sale({
          amount: '10.00',
          paymentMethodNonce: nonce,
    }, function (err, result) {
      res.render('checkout', { result: JSON.stringify(result)});
    });
});




//app.use(bodyParser.urlencoded({extended: true}));

app.post('#checkout', function(req, res){
    console.log(req.body);


    //var meal = new Meal({
        //postedby : req.body.postedby 
        //imageLink : req.body.imagelink,
        //expiration: req.body.expiration
    //})
    //meal.save(function (err, meal)
    //{
        //if(err) { 
    //}
        //res.json(201, meal)
    //})    
})

//We add here the Braintree credentials
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "ffdqc9fyffn7yn2j",
  publicKey: "qj65nndbnn6qyjkp",
  privateKey: "a3de3bb7dddf68ed3c33f4eb6d9579ca"
});

//Send a client token to your client
app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) console.log(err);  
      var clientToken = response.clientToken
      res.send(clientToken);
    });
});