var userModel = require('./models/user_models.js');

module.exports = function(app, passport) {
 
                // show the home page (will also have our login links)
                app.get('/', function(req, res) {
                                res.render('home.ejs');
                });
 
                // PROFILE SECTION
                app.get('/profile', isLoggedIn, function(req, res) {
                                res.render('user_profile.ejs', {
                                                user : req.user
                                });
                });
 
                // LOGOUT
                app.get('/logout', function(req, res) {
                                req.logout();
                                res.redirect('/');
                });
 
//-----------------Authenticate login-----------
                // show the login form
                // TODO csrf token für mehr sicherheit: 1:01:37
                app.get('/login', function(req, res) {
                                res.render('user_login.ejs', { message: req.flash('loginMessage') });
                });

                // process the login form
                app.post('/login', passport.authenticate('local-login', {
                                successRedirect : '/zusage', // redirect to the secure zusage section
                                failureRedirect : '/login', // redirect back to the signup page if there is an error
                                failureFlash : true // allow flash messages
                }));
 
//----------------User Regitration------
                // show the signup form
                app.get('/register', function(req, res) {
                                res.render('user_registration.ejs', { message: req.flash('loginMessage') });
                });

                // process the signup form
                app.post('/register', passport.authenticate('local-signup', {
                                successRedirect : '/profile', // redirect to the secure zusage section
                                failureRedirect : '/register', // redirect back to the signup page if there is an error
                                failureFlash : true // allow flash messages
                }));
 
//---------------Authorizing already logining
                // local login
                app.get('/connect/local', function(req, res) {
                                res.render('user_login.ejs', { message: req.flash('loginMessage') });
                });
                app.post('/connect/local', passport.authenticate('local-signup', {
                                successRedirect : '/zusage', // redirect to the secure zusage section
                                failureRedirect : '/local', // redirect back to the signup page if there is an error
                                failureFlash : true // allow flash messages
                }));
 
//---------------Unlink Account
/* used to unlink accounts. for social accounts, just remove the token
 for local account, remove email and password
 user account will stay active in case they want to reconnect in the future
*/
                // local login
                app.get('/unlink/local', function(req, res) {
                                var user            = req.user;
                                user.local.email    = undefined;
                                user.local.password = undefined;
                                user.nachname       = undefined;
                                user.vorname        = undefined;
                                user.save(function(err) {
                                                res.redirect('/profile');
                                });
                });

                app.post('/change/profile', isLoggedIn, function(req, res) {
                        console.log('bin in /change/profile');
                        var email = req.user.local.email;
                        var query = {'local.email': email};
                        var update = {$set:{
                                'nachname': req.body.nachname,
                                'vorname': req.body.vorname,
                                'local' : {
                                    'email' : req.user.local.email,
                                    'password' : req.user.local.password
                                    }
                                }};
                        var options = {upsert: true};

                        userModel.findOneAndUpdate(query, update, options, function(err, aktuellesObj) {
                                                if (err) return handleError(err);
                                                // console.log('Aktuallisierte Zusage: ' + aktuellesObj);
                                                res.render('user_profile.ejs', {user : aktuellesObj});
                                        }
                                );
                });
};
 
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
                if (req.isAuthenticated())
                                return next();               
                res.redirect('/login');
}