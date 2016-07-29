var express = require('express');
var logger = require('morgan');
var app = express();

app.use(logger('dev')) ;
app.use(require('./controllers'));
var port = process.env.PORT || 8080;

var server = app.listen(port, function () {
	console.log('Server', process.pid, 'listening on', port)
});
