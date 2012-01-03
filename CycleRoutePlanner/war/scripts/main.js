var map;
var elevatorSvc;
var directionsSvc;
var directionsRdr;
var clicks;
var combinedRoute;
var distance;

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
	resetRoute();
}


function log(msg) {
	var logWindow = document.getElementById("log");
	logWindow.value += msg;
	logWindow.scrollTop = logWindow.scrollHeight;
}

function clickHandler(event) {
	var latLng = event.latLng;
	clicks.push(latLng);
	log("Position: " + latLng + "\n");
	
	if(clicks.length < 2){
		return;
	}

	var start = clicks[clicks.length-2];
	var end = clicks[clicks.length-1];
	var request = {
			origin:start,
			destination:end,
			//travelMode:google.maps.TravelMode.BICYCLING,
			travelMode:google.maps.TravelMode.DRIVING,
			unitSystem:google.maps.UnitSystem.METRIC,
			provideRouteAlternatives:false
		};
	
	log("Calculating Route between: " + start + " and " + end + "\n");
	
	directionsSvc.route(request, function(result, status){
		if(status == google.maps.DirectionsStatus.OK){
			var rr = result.routes[0];
			distance += rr.legs[0].distance.value;
			if(combinedRoute == null){
				combinedRoute = result;
			} else {
				var cr = combinedRoute.routes[0];
				// Combining taken from : http://lemonharpy.wordpress.com/2011/12/15/working-around-8-waypoint-limit-in-google-maps-directions-api/#comment-34
				cr.legs = cr.legs.concat(rr.legs);
				cr.overview_path = cr.overview_path.concat(rr.overview_path);
				cr.bounds = cr.bounds.extend(rr.bounds.getNorthEast());
				cr.bounds = cr.bounds.extend(rr.bounds.getSouthWest());
			}
			
			directionsRdr.setDirections(combinedRoute);
			document.getElementById("distance").innerText = (distance/1000.0).toFixed(2) + " km";
		} else {
			log("Failed to get route. Status: " + status + "\n");
		}
	});
}

function resetRoute(){
	lastPoint = null;
	clicks = [];
	combinedRoute = null;
	distance = 0.0;
	document.getElementById("distance").innerText = "0 m";
	//directionsRdr.setDirections(null);
}

	
	
	
	
	/*
	 * Lets do the elevations at the end...
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
	*/
	
