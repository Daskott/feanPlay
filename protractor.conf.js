exports.config = {
 framework: 'mocha', 
 specs: [ 'test/e2e/**/*.spec.js' ],
//  capabilities: {
//   browserName: 'phantomjs',
//   'phantomjs.binary.path': require('phantomjs').path
// }, 
 mochaOpts: { enableTimeouts: false } 
};