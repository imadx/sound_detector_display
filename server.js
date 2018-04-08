var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

server.listen(3000, '0.0.0.0', function(){
	console.debug('Server started...')
});

var data_user_sounds = {};
var data_user_sockets = {};

app.post('/sound', function(req, res) {
	let userID = req.body.userID;
	let soundID = req.body.soundID;
	let direction = req.body.direction;

	if (!data_user_sounds[userID]) {
		data_user_sounds[userID] = [];
	}

	let soundData = {
		id: soundID,
		direction: direction
	};

	console.debug('Data received for userID:' + userID, soundData)
	data_user_sounds[userID].push(soundData);
	sendUpdates(userID, soundData);

	res.sendStatus(200);
})

function sendUpdates(userID, soundData){
	if (data_user_sockets[userID]){
		for (var i = data_user_sockets[userID].length - 1; i >= 0; i--) {
			let socketID = data_user_sockets[userID][i];
			io.to(socketID).emit('soundData', soundData);
		}
	}	
}

io.on('connection', function (socket) {
	socket.on('userID', function(id){
		if(!data_user_sockets[id]) {
			data_user_sockets[id] = [];
		}
		data_user_sockets[id].push(socket.id);
		console.debug('IO connection on', socket.id, data_user_sockets);
	})
});