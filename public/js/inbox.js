    // var socketIO = require('socket.io-client')

	// var socketIO = process.env.socketIO
	
    var isFriends = true;
	var selectedFriend = null;
	var friends = [];

	function showFriends(){
		var html = "";
		friends = window.user.friends;

		for(var a = 0; a < window.user.friends.length; a++) {
			var data = window.user.friends[a];
			if (data.status == "Pending") {
				continue;
			}

			html += '<li data-id="' + data._id + '" onclick="friendSelected(this);">';
				html += '<figure>';
					html += '<img src="' + mainURL + '/' + data.profileImage + '">';
				html += '</figure>';

				html += '<div class="people-name">';
					html += '<span>' + data.name + '</span>';
				html += '</div>';
			html += '</li>'; 
		}
		document.getElementById("friends").innerHTML = html;

		connectSocket();
	}

	function friendSelected(self) {
		var _id = self.getAttribute("data-id");
		var index = friends.findIndex(function(friend){
			return friend._id == _id
		});
		selectedFriend = friends[index];

		var html = "";
		html += '<figure>';
			html += '<img src="' + mainURL + '/' + selectedFriend.profileImage + '">';
		html += '</figure>';
		html += '<span>' + selectedFriend.name + '</span>';
		document.getElementById("conversation-head").innerHTML = html;

		var ajax = new XMLHttpRequest();
		ajax.open("POST", "/getFriendsChat", true);

		ajax.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);

				var html = "";
				for (var a=0; a < response.data.length; a++) {
					var inbox = response.data[a];
					if (inbox.from == window.user._id) {
						html += '<li class="me">';
							html += '<p>' + inbox.message + '</p>';
						html += '</li>';
					}
					else{
						html += '<li class="you">';
							html += '<p>' + inbox.message + '</p>';
						html += '</li>';
					}
				}
				document.getElementById("chatting-area").innerHTML = html;

				var objDiv = document.getElementById("chatting-area");
				objDiv.scrollTop = objDiv.scrollHeight;
			}
		};

		var formData = new FormData();
		formData.append("accessToken", localStorage.getItem("accessToken"));
		formData.append("_id", _id);
		ajax.send(formData);
	}

	function doSendMessage(form){
		if (selectedFriend == null) {
			return false;
		}
		var message = form.message.value;

		var ajax = new XMLHttpRequest();
		ajax.open("POST", "/sendMessage", true);

		ajax.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);

				if (response.status == "success") {
					var html = "";
					html += '<li class="me">';
						html += '<p>' + message + '</p>';
					html += '</li>';

					document.getElementById("chatting-area").innerHTML += html;

					form.message.value = "";
					
					var objDiv = document.getElementById("chatting-area");
					objDiv.scrollTop = objDiv.scrollHeight;
				}
			}
		};
		var formData = new FormData(form);
		formData.append("accessToken", localStorage.getItem("accessToken"));
		formData.append("_id", selectedFriend._id);
		ajax.send(formData);

		return false;
	}

	function connectSocket() {
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "/connectSocket", true);

		ajax.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				socket.on("messageReceived", function (messageObj){
					if (selectedFriend !== null && message.from == selectedFriend._id) {
						var html = "";

						html += '<li class="you">';
							html += '<p>' + messageObj.message + '</p>'
						html += '</li>';

						document.getElementById("chatting-area").innerHTML += html;

						var objDiv = document.getElementById("chatting-area");
						objDiv.scrollTop = objDiv.scrollHeight;
					}
				});
			}
		};

		var formData = new FormData();
		formData.append("accessToken", localStorage.getItem("accessToken"));
		ajax.send(formData);
	}
