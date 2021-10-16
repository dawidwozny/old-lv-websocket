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
		var host = "ws://"+hostName+":6123";  
  
		try{  
			var socket = new WebSocket(host);  
  
			message('<p class="event">Socket Status: '+socket.readyState);  
  
			socket.onopen = function(){  
				message('<p class="event">Socket Status: '+socket.readyState+' (open)');  
			}  
  
			socket.onmessage = function(msg){   
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
					case "updatechart":
						var intdata = JSON.parse(data.data);
						graphdata.update(seriesData,intdata.sample);
						graph.update();
						break;
					case "setchart":
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

//********************************************
// MY CLASSSSSSSSSS

chartClass = function(timeInterval) {

	var addData;
	timeInterval = timeInterval || 1;

	var lastRandomValue = 200;

	var timeBase = Math.floor(new Date().getTime() / 1000);

	this.update = function(data,value){
		this.removeData(data);
		this.addArrayData(data,value);
	}

	this.addData = function(data,value) {

		var index = data[0].length;
		data.forEach( function(series) {
			series.push( { x: (index * timeInterval) + timeBase, y: value } );
		} );
	};

	this.addArrayData = function(data,values) {

		var dd=0;
		var index1 = data[0].length;
		for (var i = 0; i < values.length; i++) {
			data[i].push( { x: (index1 * timeInterval) + timeBase, y: values[i] } );
			dd = i+1;
		};
		var aa = dd;
//			data.forEach( function(series) {
//			series.push( { x: (index * timeInterval) + timeBase, y: values[0] } );
//		} );
	};

	this.removeData = function(data) {
		data.forEach( function(series) {
			series.shift();
		} );
		timeBase += timeInterval;
	};

	this.initialise = function(data,size){
		for (var i = 0; i < size; i++) {
		var index = data[0].length;
		data.forEach( function(series) {
			series.push( { x: (index * timeInterval) + timeBase, y: NaN } );
		} );
		}
	};
};

/// END OF MY CLASS

var graphdata = new chartClass(1);
var seriesData = [ [], [], [], [], [], [], [] ];
graphdata.initialise(seriesData,100);


var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

// instantiate our graph!

var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart"),
	width: 800,
	height: 200,
	renderer: 'line',
	stroke: true,
	preserve: true,
	series: [
		{
			color: palette.color(),
			data: seriesData[6],
			name: 'Process Value 7'
		}, {
			color: palette.color(),
			data: seriesData[5],
			name: 'Process Value 6'
		}, {
			color: palette.color(),
			data: seriesData[4],
			name: 'Process Value 5'
		}, {
			color: palette.color(),
			data: seriesData[3],
			name: 'Process Value 4'
		}, {
			color: palette.color(),
			data: seriesData[2],
			name: 'Process Value 3'
		}, {
			color: palette.color(),
			data: seriesData[1],
			name: 'Process Value 2'
		}, {
			color: palette.color(),
			data: seriesData[0],
			name: 'Process Value 1'
		}
	]
} );

graph.render();

var preview = new Rickshaw.Graph.RangeSlider( {
	graph: graph,
	element: document.getElementById('preview'),
} );

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	graph: graph,
	xFormatter: function(x) {
		return new Date(x * 1000).toString();
	}
} );

var annotator = new Rickshaw.Graph.Annotate( {
	graph: graph,
	element: document.getElementById('timeline')
} );

var legend = new Rickshaw.Graph.Legend( {
	graph: graph,
	element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
	graph: graph,
	legend: legend
} );

var order = new Rickshaw.Graph.Behavior.Series.Order( {
	graph: graph,
	legend: legend
} );

var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
	graph: graph,
	legend: legend
} );

var smoother = new Rickshaw.Graph.Smoother( {
	graph: graph,
	element: document.querySelector('#smoother')
} );

var ticksTreatment = 'glow';

var xAxis = new Rickshaw.Graph.Axis.Time( {
	graph: graph,
	ticksTreatment: ticksTreatment,
	timeFixture: new Rickshaw.Fixtures.Time.Local()
} );

xAxis.render();

var yAxis = new Rickshaw.Graph.Axis.Y( {
	graph: graph,
	tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
	ticksTreatment: ticksTreatment
} );

yAxis.render();


var controls = new RenderControls( {
	element: document.querySelector('form'),
	graph: graph
} );

// add some data every so often

var messages = [
	"Changed home page welcome message",
	"Minified JS and CSS",
	"Changed button color from blue to green",
	"Refactored SQL query to use indexed columns",
	"Added additional logging for debugging",
	"Fixed typo",
	"Rewrite conditional logic for clarity",
	"Added documentation for new methods"
];


function addAnnotation(force) {
	//if (messages.length > 0 && (force || Math.random() >= 0.95)) {
	//	annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
	//	annotator.update();
	//}
}

addAnnotation(true);
//setTimeout( function() { setInterval( addAnnotation, 6000 ) }, 6000 );

var previewXAxis = new Rickshaw.Graph.Axis.Time({
	graph: preview.previews[0],
	timeFixture: new Rickshaw.Fixtures.Time.Local(),
	ticksTreatment: ticksTreatment
});

previewXAxis.render();
  
}); 