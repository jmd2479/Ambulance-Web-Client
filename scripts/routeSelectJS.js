var ambImgage = './images/ambulance.png';
var oneImgage = './images/one.jpg';
var twoImgage = './images/two.jpg';
var threeImgage = './images/three.jpg';
$(document).ready(function(){
	
	populateHospNames();
	//navigator.geolocation.getCurrentPosition(initialize);
	initialize();
	$("#selectHosp1Btn").click(function(){
		//add call to rabbitMQ to let the hospital know the ambulance is coming
		addSelectedHospToWebStorage(localStorage.hospital0Name, localStorage.hospital0Address, localStorage.hospital0Lat, localStorage.hospital0Lon, localStorage.hospital0ID);
		window.open("deployRoute.html", "_self");
	});
	
	$("#selectHosp2Btn").click(function(){
		//add call to rabbitMQ to let the hospital know the ambulance is coming
		addSelectedHospToWebStorage(localStorage.hospital1Name, localStorage.hospital1Address, localStorage.hospital1Lat, localStorage.hospital1Lon, localStorage.hospital1ID);
		window.open("deployRoute.html", "_self");
	});
	
	$("#selectHosp3Btn").click(function(){
		//add call to rabbitMQ to let the hospital know the ambulance is coming
		addSelectedHospToWebStorage(localStorage.hospital2Name, localStorage.hospital2Address, localStorage.hospital1Lat, localStorage.hospital1Lon, localStorage.hospital2ID);
		window.open("deployRoute.html", "_self");
	});
})

function populateHospNames(){
	$("#hosp0Name").text("1. " + localStorage.hospital0Name);
	$("#hosp0Address").text(localStorage.hospital0Address);
	$("#hosp0ETA").text("ETA: " + localStorage.hospital0Eta);
	
	$("#hosp1Name").text("2. " + localStorage.hospital1Name);
	$("#hosp1Address").text(localStorage.hospital1Address);
	$("#hosp1ETA").text("ETA: " + localStorage.hospital1Eta);
	
	$("#hosp2Name").text("3. " + localStorage.hospital2Name);
	$("#hosp2Address").text(localStorage.hospital2Address);
	$("#hosp2ETA").text("ETA: " + localStorage.hospital2Eta);
}

function addSelectedHospToWebStorage(hospName, hospAddrss, hospLat, hospLon, hospID){
	if (typeof(Storage) != "undefined") {

	//save the json data in the browser 
	localStorage.chosenHospitalName = hospName;
	localStorage.chosenHospitalAddress = hospAddrss;
	localStorage.chosenHospitalLat = hospLat;
	localStorage.chosenHospitalLon = hospLon;
	localStorage.chosenHospitalID = hospID;
	} else {
		alert("Sorry, your browser does not support Web Storage...");
	}
}

function initialize(){
	//Create a google map.  Add markers for the ambulance's current location and the location
	//of each of the three hospitals
	//var myLocation = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
	var myLocation = new google.maps.LatLng(localStorage.ambulanceLat, localStorage.ambulanceLon);
	var hospital0Location = new google.maps.LatLng(localStorage.hospital0Lat, localStorage.hospital0Lon);
	var hospital1Location = new google.maps.LatLng(localStorage.hospital1Lat, localStorage.hospital1Lon);
	var hospital2Location = new google.maps.LatLng(localStorage.hospital2Lat, localStorage.hospital2Lon);
	var mapOptions = {
		center: myLocation,
		zoom: 12
	};				
	map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);	
	
	var initialLocationMarker = new google.maps.Marker({
		position: myLocation,
		icon: ambImgage,
		map: map
	});
	
	var hospital0Marker = new google.maps.Marker({
		position: hospital0Location,
		icon: oneImgage,
		map: map
	});
	
	var hospital1Marker = new google.maps.Marker({
		position: hospital1Location,
		icon: twoImgage,
		map: map
	});
	
	var hospital2Marker = new google.maps.Marker({
		position: hospital2Location,
		icon: threeImgage,
		map: map
	});
	
}

