// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
// var postsRouter = require('./controllers/api/posts');
// var staticRouter = require('./controllers/static');
// var sessionRouter = require('./controllers/api/sessions');
// var usersRouter = require('./controllers/api/users');

// app.use(bodyParser.json());
// app.use(require('./auth'));
// app.use('/api/sessions', sessionRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/posts', postsRouter); //set api calls
// app.use(staticRouter); //set static calls

// var server = app.listen(5000, function () {
//   console.log('Server listening on', 5000)
// });

// require('./websockets').connect(server);//add websockest to node server
var express = require('express');
var logger = require('morgan'); 
var app = express();

app.use(logger('dev')) ;
app.use(require('./controllers'));
var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
	console.log('Server', process.pid, 'listening on', port)
});

//websockets.connect(server);
