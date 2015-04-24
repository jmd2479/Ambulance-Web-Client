var directionsService = new google.maps.DirectionsService();
var map;
var markers = [];
var img = './images/ambulance.png';
var currentLocation;
var ambID;
var eta = "";

//for rabbitMQ messaging
var ws;
var client;

function initialize(){

	directionsDisplay = new google.maps.DirectionsRenderer();
	currentLocation = new google.maps.LatLng(localStorage.ambulanceLat, localStorage.ambulanceLon);
	var mapOptions = {
		center: currentLocation,
		zoom: 15
	};				
	map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);	
	directionsDisplay.setMap(map);
	var initialLocationMarker = new google.maps.Marker({
		position: currentLocation,
		icon: img,
		map: map
	});
	markers.push(initialLocationMarker);

}

function calcRoute(selectedHospitalAddress) {
	var start = currentLocation.k + "," + currentLocation.D;
	var end = selectedHospitalAddress;
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			showSteps(response);
		}
	});
}


function showSteps(directionResult) {

	var myRoute = directionResult.routes[0].legs[0];
	var totalPath = [];
	var stepByStepDirections = [];
	for(var i = 0; i < myRoute.steps.length; i++)
	{
		var _direction = { increment: totalPath.length, instruction: myRoute.steps[i].instructions };
		stepByStepDirections.push(_direction);
		for(var j = 0; j < myRoute.steps[i].path.length-1; j++)
		{
			var startLat = myRoute.steps[i].path[j].k;
			var startLon = myRoute.steps[i].path[j].D;
			var endLat = myRoute.steps[i].path[j+1].k;
			var endLon = myRoute.steps[i].path[j+1].D;
			var distance = getDistanceFromLatLonInKm(startLat, startLon, endLat, endLon);
			
			var jumps = Math.round(distance*1000); //given distance in km: jumps = (xkm)(1000m/km)(1jump/10m)
			if (jumps < 1)
			{
				jumps = 1;
			}
					
			var latIncrement = (endLat - startLat)/jumps;
			var lngIncrement = (endLon - startLon)/jumps;
			var currentLat = startLat;
			var currentLng = startLon;
			
			for (var k = 0; k < jumps; k++)
			{
				totalPath.push(new google.maps.LatLng(currentLat, currentLng));
				currentLat += latIncrement;
				currentLng += lngIncrement;
			}
		}
	}
	//Let the hospital know our ambulance is on the way

	
	//Now that we have an array of LatLng objects that cover the entire trip in 10 meter increments
	//we can iterate through the array at one tenth second intervals and push locations on the map

	var arrayCounter = 0;

	markers[0].setMap(null);
	markers = [];
	var myTimer = setInterval(function(){ 
		var coords = [
			totalPath[arrayCounter],
			totalPath[arrayCounter+1]
		];
		var currentMarker = new google.maps.Marker({
			position: coords[0],
			map: map,
			icon: img
		});
		markers.push(currentMarker);
		currentLocation= coords[0];
		//update the location of the ambulance in local storage
		localStorage.ambulanceLat = currentLocation.k;
		localStorage.ambulanceLon = currentLocation.D;
		
		if(markers.length > 1)
		{
			markers[markers.length-2].setMap(null); //This removes the previous marker from being associated with the map, does NOT delete it from the markers array
		}

		if(stepByStepDirections.length != 0)
		{
			if(arrayCounter == stepByStepDirections[0].increment)
			{
				if(stepByStepDirections.length > 1){
					if(stepByStepDirections[0].instruction.slice(0,4) == "Turn")
					{
						document.getElementById("currentDirection").innerHTML = stepByStepDirections[1].instruction;
						document.getElementById("nextDirection").innerHTML = "";
					}
					else if(stepByStepDirections[0].instruction.slice(0,4) == "Head")
					{
						if(stepByStepDirections.length > 1){
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = stepByStepDirections[1].instruction;
						}
						else{
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = "";
						}
					}
					else if(stepByStepDirections[0].instruction.slice(0,4) == "Take")
					{
						if(stepByStepDirections.length > 1){
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = stepByStepDirections[1].instruction;
						}
						else {
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = "";
						}
					}
					else if(stepByStepDirections[0].instruction.slice(0,8) == "Continue")
					{
						if(stepByStepDirections.length > 1){
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = stepByStepDirections[1].instruction;
						}
						else {
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = "";
						}
					}
					else if(stepByStepDirections[0].instruction.slice(0,4) == "Make")
					{
						if(stepByStepDirections.length > 1){
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = stepByStepDirections[1].instruction;
						}
						else {
							document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
							document.getElementById("nextDirection").innerHTML = "";
						}
					}
				}
				else{
					document.getElementById("currentDirection").innerHTML = stepByStepDirections[0].instruction;
					document.getElementById("nextDirection").innerHTML = "";
				}
				stepByStepDirections.shift();
			/*
				if(stepByStepDirections.length > 1){
					document.getElementById("singleDirectionDiv").innerHTML = stepByStepDirections[0].instruction + "</br>" + stepByStepDirections[1].instruction;
				}
				else {
					document.getElementById("singleDirectionDiv").innerHTML = stepByStepDirections[0].instruction;
				}
				stepByStepDirections.shift();
			*/
			}
		}
		if(markers.length % 200 == 0)
		{
			map.setCenter(markers[markers.length-1].getPosition());
			markers[markers.length-1].setMap(null);
			markers = [];
		}
		arrayCounter++;

		if (arrayCounter == totalPath.length-1)
		{
			var currentMarker = new google.maps.Marker({
			position: coords[1],
			map: map,
			icon: img
			});
			markers.push(currentMarker);
			if(arrayCounter > 0)
			{
				markers[arrayCounter-1].setMap(null);
			}
			logout();
			clearInterval(myTimer);
			
		}
		
		if(arrayCounter%150 == 0){
			pingLocation(totalPath[arrayCounter].k, totalPath[arrayCounter].D);
		}
	}, 100);
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	console.log('in getDistanceFromLatLonInKm');
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180);
}

//Shouldn't need to check in with Rest at this point, already done.  Delete this function
/* function checkInWithRest(_ambulanceID, _ambLat, _ambLon, _lastUpdate, _targetHospital, _eta, _patientAge, _patientCategory){
	var searchForAmbID = location.search;
	console.log(searchForAmbID);
	var jsonData = '{ "ambulanceID" : ' + 4000 + ', "ambLat" : ' + 30.0000 + ', "ambLon": ' + -98.00002 + ' }';
	$.ajax({
		method: "POST",
		url: "http://107.188.249.238/er-rest-1.0/ambulance",
		data: jsonData,
		dataType: "json",
		contentType: "application/json; charset=utf-8"
	}).done(function( data ) {
		alert( "Server Response: " + data.message );
	}).fail(function(jqXHR, textStatus, error) {
		alert("Sorry. Server unavailable." + error + jqXHR.response.Text);
	});
} */

function pingLocation(_ambLat, _ambLon){
	//May need to send eta when pinging location.  If so use (note, will return "" the first time so check for that): calculateETA(_ambLat, _ambLon);
	var jsonData = JSON.stringify({"ambulanceID": localStorage.ambulanceID, "ambLat": _ambLat,"ambLon": _ambLon, "lastUpdate": null,"targetHospital": localStorage.chosenHospitalID, "eta": null, "patientAge": localStorage.patientAge, "patientCategory": localStorage.patientTraumaLevel});
	$.ajax({
		method: "POST",
		url: "http://107.188.249.238:8080/er-rest-1.0/ambulance",
		data: jsonData,
		dataType: "json",
		contentType: "application/json; charset=utf-8"
	}).done(function( data ) {
		console.log( "Server Response from pingLocation attempt: " + data.message );
	}).fail(function(jqXHR, textStatus, error) {
		alert("Sorry, unable to ping ambulance current location. Server unavailable." + error + jqXHR.response.Text);
	});
}

function logout(){
	//May need to send eta when pinging location.  If so use (note, will return "" the first time so check for that): calculateETA(_ambLat, _ambLon);
	//var jsonData = '{ "ambulanceID" : ' + localStorage.ambulanceID + ', "ambLat" : ' + _ambLat + ', "ambLon": ' + _ambLon + ' }';
	var jsonData = JSON.stringify({"ambulanceID": localStorage.ambulanceID, "ambLat": null,"ambLon": null, "lastUpdate": null,"targetHospital": null, "eta": null, "patientAge": null, "patientCategory": null});
	$.ajax({
		method: "POST",
		url: "http://107.188.249.238:8080/er-rest-1.0/ambulance",
		data: jsonData,
		dataType: "json",
		contentType: "application/json; charset=utf-8"
	}).done(function( data ) {
		console.log( "Server Response from pingLocation attempt: " + data.message );
	}).fail(function(jqXHR, textStatus, error) {
		alert("Sorry, unable to ping ambulance current location. Server unavailable." + error + jqXHR.response.Text);
	});
}

$(document).ready(function()
{
	$("#titleDiv").append('<p style="font-size:1.5em;">' + localStorage.chosenHospitalName + '</p>');
	alert("Hospital: " + localStorage.chosenHospitalID);
	initialize();
	$("#rerouteBtn").click(function(){
		window.open("routeSelect.html", "_self");  
	});
	
	$("#beginRouteBtn").click(function(){
		$("#beginRouteBtn").remove();
		calcRoute(localStorage.chosenHospitalAddress);
	});

});


//Used to get the eta when pinging current location IF NEEDED
/* function calculateETA(currentLat, currentLon) {
  var service = new google.maps.DistanceMatrixService();
  var origin = new google.maps.LatLng(currentLat, currentLon);
  var destination = new google.maps.LatLng(localStorage.chosenHospitalLat, localStorage.chosenHospitalLon);
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
	var currentETA = response.rows[0].elements[0].duration.text;
	eta = currentETA.substring(0, currentETA.indexOf(" "));
  }
} */

