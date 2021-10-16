$(document).ready(function() {  
  
	if(!("WebSocket" in window)){  
		$('#chatLog, input, button, #examples').fadeOut("fast");  
		$('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');  
	} else {  
		//The user has WebSockets  
	  
		connect();  
	
	}
	function connect(){  
		var socket;  
		var hostName = window.location.hostname;
		var host = "ws://"+hostName+":6122"; 
  
		try{  
			var socket = new WebSocket(host);  
  
			message('<p class="event">Socket Status: '+socket.readyState);  
  
			socket.onopen = function(){  
				message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
			}  
  
			socket.onmessage = function(msg){  
				message('<p class="message">Received: '+msg.data); 
				// nessage handler
				var data = JSON.parse(msg.data)
				switch(data.msg)
				{
					case "toggle1":
						//simple toggling
						var led1 = document.getElementById("webled1");
						if(led1.textContent == "Web LED 1 : ON"){
							led1.textContent = "Web LED 1 : OFF"
						} else{
							led1.textContent = "Web LED 1 : ON"
						}
						break;
					case "toggle2":
						//simple toggling
						var led2 = document.getElementById("webled2");
						if(led2.textContent == "Web LED 2 : ON"){
							led2.textContent = "Web LED 2 : OFF"
						} else{
							led2.textContent = "Web LED 2 : ON"
						}
						break;
					case "usertextfedback":
						var webusertextfeedback = document.getElementById("webusertextfeedback");
						webusertextfeedback.value = data.data;
					break;
					case "usertextserver":
						var webusertextfeedback = document.getElementById("servusertext");
						webusertextfeedback.value = data.data;
						break;
					case "toggleled1fed":
						var servled1 = document.getElementById("servled1");
						if(data.data == "ON"){
							servled1.textContent = "Server LED 1 : ON"
						} else{
							servled1.textContent = "Server LED 1 : OFF"
						}
						break;		
					case "toggleled2fed":
						var servled2 = document.getElementById("servled2");
						if(data.data == "ON"){
							servled2.textContent = "Server LED 2 : ON"
						} else{
							servled2.textContent = "Server LED 2 : OFF"
						}
						break;													
					default:
				}
			}  
  
			socket.onclose = function(){  
				message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');  
			}           
  
		} catch(exception){  
			message('<p>Error'+exception);  
		}  
  
		function send(){  
			var text = $('#webusertext').val(); 
			var data ={"msg":"usertext","data":text};
			var strdata =JSON.stringify(data);
  
			if(text==""){  
				message('<p class="warning">Please enter a message');  
				return;  
			}  
			 
			try {  
				socket.send(strdata);  
				message('<p class="event">Sent: '+strdata)  
  
			} catch(exception){  
				message('<p class="warning">');  
			}  
			$('#webusertext').val("");  
		}  
  
		function message(msg){  
			$('#chatLog').append(msg+'</p>');  
		}  
  
		$('#webusertext').keypress(function(event) {  
			if (event.keyCode == '13') {  
				send();  
			}  
		});     
  
		$('#disconnect').click(function(){  
			socket.close();  
		});

		$('#servled1btn').click(function(){
			var data ={"msg":"toggleled1","data":""};
			var strdata =JSON.stringify(data);
			socket.send(strdata);
			message('<p class="event">Sent: '+strdata) 
		});

		$('#servled2btn').click(function(){
			var data ={"msg":"toggleled2","data":""};
			var strdata =JSON.stringify(data);
			socket.send(strdata);
			message('<p class="event">Sent: '+strdata) 
		});    
  
	} //End connect  
  
}); 