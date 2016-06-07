// var app = angular.module('app');
// var addr = "10.151.96.227"//'localhost';
// app.run(function ($rootScope, $timeout) {
// 	(function connect() {
// 		var url = 'ws://'+addr+':5000';
// 		var connection = new WebSocket(url);
// 		connection.onclose = function (e) {
// 			console.log('WebSocket closed. Reconnecting...');
// 			$timeout(connect, 10*1000);
// 		}
// 		connection.onmessage = function (e) {
// 			var payload = JSON.parse(e.data);
// 			console.log('recieve broadcast')
// 			$rootScope.$broadcast('ws:' + payload.topic, payload.data);
// 		}
// 	})();
// });


// // .service('WebSocketSvc', function ($rootScope) {
// // 	function websocketHost() {
// // 		if ($window.location.prot ocol === "https:") {
// // 			return "wss://" + window.location.host
// // 		} else {
// // 			return "ws://" + window.location.host
// // 		}
// // 	}
// // 	var connection this.connect = function () {
// // 		connection = new WebSocket(websocketHost()) connection.onmessage = function (e) {
// // 			var payload = JSON.parse(e.data) $rootScope.$broadcast('ws:' + payload.topic, payload.data)
// // 		}
// // 	}
// // 	this.send = function (topic, data) {
// // 		var json = JSON.stringify({topic: topic, data: data
// // 		})
// // 		connection.send(json)
// // 	}
// // }).run(function (WebSocketSvc) {
// // 	WebSocketSvc.connect()
// // })
