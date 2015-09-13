
src="https://js.braintreegateway.com/v2/braintree.js"


var braintree = require("braintree");


app.get('/', function (req, res) {
    res.render('index');
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
    var nonce = req.body.payment_method_nonce;
    
    gateway.transaction.sale({
          amount: '10.00',
          paymentMethodNonce: 'nonce-from-the-client',
    }, function (err, result) {
       
    });
    res.render('checkout');
});




app.use(bodyParser.urlencoded({extended: true}));

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
    environment:  braintree.Environment.Sandbox,
	  merchantId: "7pjxhyv3rr2yzn69",
	  publicKey: "7jk9hk8fhmjhxw47",
	  privateKey: "u7d44457d9a64e2a849660a4d0b0d3be9"
});

//Send a client token to your client
app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
        
      var clientToken = response.clientToken
      res.send(clientToken);
    });
});


