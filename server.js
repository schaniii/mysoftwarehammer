// server.js
 
// get all the tools we need
var express  = require('express');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

var configDB = require('./config/database.js');
 
var app      = express();
var port     = process.env.PORT || 65102;
 
// configuration
mongoose.connect(configDB.url, configDB.options); // connect to our database
 
require('./config/passport')(passport); // pass passport for configuration
 
// express application configuration
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies need for the authenticatiom
app.use(bodyParser()); // get information from html forms

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public')); // for static content like images
app.use(express.static(__dirname + '/node_modules/bootstrap/dist' )); 

// required for passport
app.use(expressSession({   
	cookieName: 'session', 
	secret: 'mindstickarticles', //create sessin mindsticarticle
	duration: 30 * 60 * 1000, 
	activeDuration: 5 * 60 * 1000, 
	httpOnly: true, // dont let browser javascript access cookies ever
	secure: true, // only use cookies over https
	ephemeral: true, // delete this cookie when the browser is closed
}));
app.use(passport.initialize()); // passport intialize
app.use(passport.session()); // persistent login sessions of passport
app.use(flash()); // use connect-flash for flash messages stored in session

 
// load our routes for work routes file

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
 
// launch the application at port 8080
app.listen(port); // it listen at port 8080
console.log('Application running on port: ' + port);