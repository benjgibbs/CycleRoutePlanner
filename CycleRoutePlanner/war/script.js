 
var map;
var elevator;

function initialize() {
    var latlng = new google.maps.LatLng(51.0, -1.5);
    var myOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var canvas = document.getElementById("map_canvas");
    
    map = new google.maps.Map(canvas, myOptions);
    elevator  = new google.maps.ElevationService();
    
    google.maps.event.addListener(map,'click',clickHandler)
  }

function clickHandler(event) {
	var log = document.getElementById("log");
	var latlong = event.latLng;
	var locations = []
	locations.push(latlong)
	var positionalRequest = {
		'locations':locations
	}
	log.value += "Position: " + latlong + " Elevation: ";
	
	// Initiate the location request
    elevator.getElevationForLocations(positionalRequest, function(results, status) {
      if (status == google.maps.ElevationStatus.OK) {

        // Retrieve the first result
        if (results[0]) {
          log.value += results[0].elevation + "m\n"
        } else {
          alert("No elevation found");
        }
      } else {
        alert("Elevation service failed due to: " + status);
      }
    });

	
	
	log.scrollTop = log.scrollHeight;
}



