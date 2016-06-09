var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jabber', function () {
  console.log('mongodb connected');
});

module.exports = mongoose;
