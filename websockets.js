// var _ = require('lodash'); 
// var ws = require('ws'); 
// var clients = []; 

// exports.connect = function (server) { 
// 	var wss = new ws.Server({server: server}); 
// 	wss.on('connection', function (ws) { 
// 		clients.push(ws);
// 		console.log('WebSocket connected');
// 		// console.log() 
// 		//exports.broadcast('new client joined','mwqd');
// 		ws.on('close', function () { 
// 			_.remove(clients, ws) 
// 		}); 
// 	}); 
// }

// exports.broadcast = function (topic, data) { 
// 	var json = JSON.stringify({topic: topic, data: data}); 
// 	console.log("send broadcast");
// 	clients.forEach(function (client) { 
// 		client.send(json); 
// 	}); 
// }