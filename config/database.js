
// config/database.js

// Uberspace mongodb
// var options = { auth:{authdb:"admin"},
// 				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 
// var uri = 'mongodb://mohadipe_mongoadmin:nekAunic@localhost:20883/moha_hochzeit';
// module.exports = { 'url' : uri,
// 				   'options' : options
// 				 };

// develop lokaler PC
module.exports = { 'url' : 'mongodb://localhost:27017/myshammer'};