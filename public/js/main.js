var app = new Vue({
  el: '#app',
  data: {
    soundData: []
  },
  methods: {
  	updateData: function(data){
  		this.soundData.push(data);
  	}
  }
})

var socket = io.connect();
initializeUser();

socket.on('soundData', function (data) {
	console.log(data);
	app.updateData(data);
	// socket.emit('my other event', { my: 'data' });
});

function initializeUser(){
	var userIDKey = 'userID';
	var id = localStorage.getItem(userIDKey);
	if(!id) {
		id = prompt('Enter your user ID:');
		if(id) {
			localStorage.setItem(userIDKey, id);
		}
	}

	if(id) {
		socket.emit('userID', id);	
	}
}