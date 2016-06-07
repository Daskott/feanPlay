var db = require('../database_config');

var user = db.model('User',{
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false}
});

module.exports = user;
