var express = require('express');

  
var passport = require('passport');

var app = express();
  app.use(passport.initialize());
  app.use(passport.session());
var FacebookStrategy = require('passport-facebook').Strategy;

var mongoose = require('mongoose');
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

mongoose.connect('mongodb://sven:octopus@ds053469.mongolab.com:53469/turtl');

    var userSchema = mongoose.Schema({
    	id : String,
    	user : String,
    	access_token : String,
    	firstName : String,
        lastName : String,
        //email : String,
        wellbeing: String
    });
    var User = mongoose.model('User', userSchema);

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
});


passport.use('facebook', new FacebookStrategy({
  clientID        : '1683828921836504',
  clientSecret    : 'b77ee66400fa76d91a88b46e7c56a728',
  callbackURL     : 'http://bf36fd31.ngrok.io/login/facebook/callback'
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    // asynchronous
    console.log('access_token: ' + access_token);
    console.log('refresh_token: ' + refresh_token);
    console.log('profile: ' + JSON.stringify(profile));
    process.nextTick(function() {
     
      // find the user in the database based on their facebook id
      User.findOne({ 'id' : profile.id }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.id    = profile.id; // set the users facebook id                 
            newUser.access_token = access_token; // we will save the token that facebook provides to the user                    
            newUser.firstName  = profile.name.givenName;
            newUser.lastName = profile.name.familyName;
            newUser.user = "Sven" 
            newUser.wellbeing = "ok" 


            // look at the passport user profile to see how names are returned
            //newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
}));

// route for facebook authentication and login
// different scopes while logging in
app.get('/login/facebook', 
  passport.authenticate('facebook', { scope : 'email' }
));
 
// handle the callback after facebook has authenticated the user
app.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/home',
    failureRedirect : '/'
  })
);


 
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

app.get('/basic', function (req, res) {
    res.render('basic');
});

app.get('/index', function (req, res) {
    res.render('index');
});

app.get('/home', function (req, res) {
	    var thisUser = db.collections.users.findOne({id : req.query.user}, function (err, doc) {
   	    if(doc){
   	    	res.render('home', { user: doc, wellbeing: doc.wellbeing });
   	    }else{
   	    	var user = new User({user: req.query.user,
            wellbeing: req.query.wellbeing});
            user.save(function(err, user) {
            if (err) return console.error(err);
            console.dir(user);
            });
   	    	res.render('home', {user: 'test', wellbeing: 'ok'});
   	    }

         
    	});
});

app.get('/helping', function (req, res) {
    res.render('helping');
});

app.get('/markets', function (req, res) {
    res.render('markets');
});

app.get('/braintree', function (req, res){
    res.render('braintree');
});

app.get('/test1', function (req, res) {
    res.render('test1');
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