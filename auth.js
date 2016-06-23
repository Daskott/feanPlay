var jwt = require('jwt-simple'); 
var config = require('./config');

module.exports = function (request, response, next) { 
	// if (request.headers['x-auth']) { 
	// 	request.auth = jwt.decode(request.headers['x-auth'], config.secret); 
	// }
	//return response.sendStatus(401); //unauthorized
	next();
}