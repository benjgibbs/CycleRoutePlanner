var map;
var elevatorSvc;
var directionsSvc;
var directionsRdr;

var points;

function initialize() {
	var home = new google.maps.LatLng(51.0747504771771, -1.3252487182617188);
	//var latlng = new google.maps.LatLng(51.0, -1.5);
	var myOptions = {
		zoom : 14,
		center : home,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var canvas = document.getElementById("map_canvas");

	map = new google.maps.Map(canvas, myOptions);
	elevatorSvc = new google.maps.ElevationService();
	directionsSvc = new google.maps.DirectionsService();
	directionsRdr = new google.maps.DirectionsRenderer();
	directionsRdr.setMap(map);
	google.maps.event.addListener(map, 'click', clickHandler);
	points = [];
}


function log(msg) {
	var logWindow = document.getElementById("log");
	logWindow.value += msg;
	logWindow.scrollTop = logWindow.scrollHeight;
}

function clickHandler(event) {
	
	var latLng = event.latLng;
	points.push(latLng);
	if(points.length > 1) {
		var start = points[0];
		var end = points[points.length-1];
		var waypts = [];
		for(var idx = 1; idx < points.length-2; ++idx){
			waypts.push({
				location:points[idx],
				stopover:false
			});
		}
		
		log("Calculating Route between: " + start + " and " + end + "\n");
		
		var request = {
			origin:start,
			destination:end,
			waypoints:waypts,
			//travelMode:google.maps.TravelMode.BICYCLING,
			travelMode:google.maps.TravelMode.DRIVING,
			unitSystem:google.maps.UnitSystem.METRIC,
			provideRouteAlternatives:false
		};
		
		directionsSvc.route(request, function(result, status){
			if(status == google.maps.DirectionsStatus.OK){
				directionsRdr.setDirections(result);
				document.getElementById("distance").innerText = result.routes[0].legs[0].distance.text;
			} else {
				log("Failed to get route. Status: " + status + "\n");
			}
		});
	}

	log("Position: " + latLng + " Elevation: ");
	
	
	var locations = [];
	locations.push(latLng);
	var positionalRequest = {
		'locations' : locations
	};
	// Initiate the location request
	elevatorSvc.getElevationForLocations(positionalRequest, function(results, status) {
		if (status == google.maps.ElevationStatus.OK) {

			// Retrieve the first result
			if (results[0]) {
				log(results[0].elevation + "m\n");
				log.scrollTop = log.scrollHeight;
			} else {
				alert("No elevation found");
			}
		} else {
			alert("Elevation service failed due to: " + status);
		}
	});

	
}
