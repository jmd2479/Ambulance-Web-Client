var patientAge;
var patientGender;
var patientTraumaLevel;
var ambulanceID;
var myLocation;
	
$(document).ready(function(){
	
	navigator.geolocation.getCurrentPosition(initialize);
	
	$("#childBtn").click(function() {	
		localStorage.patientAge = "child";
		patientAge = "child";
		setRadio(".ageBtn", "#childBtn");
	});
	
	$("#teenBtn").click(function() {	
		localStorage.patientAge = "teen";
		patientAge = "teen";
		setRadio(".ageBtn", "#teenBtn");
	});
	
	$("#adultBtn").click(function() {	
		localStorage.patientAge = "adult";
		patientAge = "adult";
		setRadio(".ageBtn", "#adultBtn");
	});

	
	$("#maleBtn").click(function() {	
		localStorage.patientGender = "male";
		patientGender = "male";
		setRadio(".genderBtn", "#maleBtn");
	});
	
	$("#femaleBtn").click(function() {	
		localStorage.patientGender = "female";
		patientGender = "male";
		setRadio(".genderBtn", "#femaleBtn");
	});
	
	
	$("#minorTramaBtn").click(function() {	
		localStorage.patientTraumaLevel = "minor";
		patientTraumaLevel = "minor";
		setRadio(".traumaBtn", "#minorTramaBtn");
	});
	
	$("#severeTramaBtn").click(function() {	
		localStorage.patientTraumaLevel = "severe";
		patientTraumaLevel = "severe";
		setRadio(".traumaBtn", "#severeTramaBtn");
	});
	
	$("#tramaBurnBtn").click(function() {	
		localStorage.patientTraumaLevel = "burn";
		patientTraumaLevel = "level1";
		setRadio(".traumaBtn", "#tramaBurnBtn");
	});
	
	$("#tramaSTEMIBtn").click(function() {	
		localStorage.patientTraumaLevel = "stemi";
		patientTraumaLevel = "level1";
		setRadio(".traumaBtn", "#tramaSTEMIBtn");
	});
	
	$("#tramaStrokeBtn").click(function() {	
		localStorage.patientTraumaLevel = "stroke";
		patientTraumaLevel = "level1";
		setRadio(".traumaBtn", "#tramaStrokeBtn");
	});
	
	$("#submitBtn").click(function() {	
		if(patientAge == null || patientGender == null || patientTraumaLevel == null){
			alert("An age, gender, and condition must be selected.");
		}
		else{
			getHospitals();
			window.open("routeSelect.html", "_self");  
		}
	});
});

function setRadio(className, ID){
	$(className).css("opacity", "1");
	$(className).css("color", "white");
	$(ID).css("opacity", ".3");
	$(ID).css("color", "#181818");
}



function initialize(location){
	myLocation = [location.coords.latitude,location.coords.longitude];
	localStorage.ambulanceLat = location.coords.latitude;
	localStorage.ambulanceLon = location.coords.longitude;
	checkInWithRest();
}


function checkInWithRest(){
	var jsonData = '{ "ambulanceID" : ' + localStorage.ambulanceID + ', "ambLat" : ' + myLocation[0] + ', "ambLon": ' + myLocation[1] + ' }';
	$.ajax({
		method: "POST",
		url: "http://107.188.249.238:8080/er-rest-1.0/ambulance",
		data: jsonData,
		dataType: "json",
		contentType: "application/json; charset=utf-8"
	}).done(function( data ) {
		alert( "Server Response: " + data.message );
	}).fail(function(jqXHR, textStatus, error) {
		alert("Sorry. Server unavailable." + error + jqXHR.response.Text);
	});
}

function getHospitals(){
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			var jsonResponse = JSON.parse(xmlhttp.responseText);
			
			localStorage.hospital0Name = jsonResponse[0].hospitalName;
			localStorage.hospital0Address = jsonResponse[0].hospitalString;
			localStorage.hospital0Lat = jsonResponse[0].hospitalLat;
			localStorage.hospital0Lon = jsonResponse[0].hospitalLon;
			localStorage.hospital0ID = jsonResponse[0].hospitalID;
			localStorage.hospital0Eta = jsonResponse[0].eta;
			
			localStorage.hospital1Name = jsonResponse[1].hospitalName;
			localStorage.hospital1Address = jsonResponse[1].hospitalString;
			localStorage.hospital1Lat = jsonResponse[1].hospitalLat;
			localStorage.hospital1Lon = jsonResponse[1].hospitalLon;
			localStorage.hospital1ID = jsonResponse[1].hospitalID;
			localStorage.hospital1Eta = jsonResponse[1].eta;
			
			localStorage.hospital2Name = jsonResponse[2].hospitalName;
			localStorage.hospital2Address = jsonResponse[2].hospitalString;
			localStorage.hospital2Lat = jsonResponse[2].hospitalLat;
			localStorage.hospital2Lon = jsonResponse[2].hospitalLon;
			localStorage.hospital2ID = jsonResponse[2].hospitalID;
			localStorage.hospital2Eta = jsonResponse[2].eta;
		}
    }
	var url = "http://107.188.249.238:8080/er-rest-1.0/shortestpath?amblat=" + myLocation[0] + "&amblon=" + myLocation[1] + "&age=" + localStorage.patientAge + "&condition=" + localStorage.patientTraumaLevel;
	xmlhttp.open("GET",url,false);
	xmlhttp.send();
}

