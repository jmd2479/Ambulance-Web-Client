$(document).ready(function()
{
	localStorage.clear();
	var IDorPW = "ID";
	$("#toggleBtn").click(function() {
		if(IDorPW == "ID")
		{
			IDorPW = "PW";
		}
		else
		{
			IDorPW = "ID";
		}
	});
	$("#num1Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("1");
		}
		else
		{
			$("#passwordDiv").append("1");	
		}
	});
	
	$("#num2Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("2");
		}
		else
		{
			$("#passwordDiv").append("2");	
		}
	});
	
	$("#num3Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("3");
		}
		else
		{
			$("#passwordDiv").append("3");	
		}
	});
	
	$("#num4Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("4");
		}
		else
		{
			$("#passwordDiv").append("4");	
		}
	});
	
	$("#num5Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("5");
		}
		else
		{
			$("#passwordDiv").append("5");	
		}
	});
	
	$("#num6Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("6");
		}
		else
		{
			$("#passwordDiv").append("6");	
		}
	});

	$("#num7Btn").click(function() {	
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("7");
		}
		else
		{
			$("#passwordDiv").append("7");	
		}
	});
	
	$("#num8Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("8");
		}
		else
		{
			$("#passwordDiv").append("8");	
		}
	});
	
	$("#num9Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("9");
		}
		else
		{
			$("#passwordDiv").append("9");	
		}
	});
	
	$("#num0Btn").click(function() {
		if(IDorPW == "ID")
		{
			$("#IDDiv").append("0");
		}
		else
		{
			$("#passwordDiv").append("0");	
		}
	});
	
	$("#backBtn").click(function() {
		if(IDorPW == "ID")
		{
			var currentText = $("#IDDiv").text().slice(0,-1);
			$("#IDDiv").text(currentText);
		}
		else
		{
			var currentText = $("#passwordDiv").text().slice(0,-1);
			$("#passwordDiv").text(currentText);	
		}
	});
	
	$("#submitBtn").click(function() {
		var pw = $("#passwordDiv").text();
		var id = $("#IDDiv").text();
		//remember ambulanceID in the browser for easy access across pages
		localStorage.ambulanceID = id.trim();
		var loginurl = "http://107.188.249.238:8080/er-rest-1.0/login?ambulanceid=" + id.trim() + "&pass=" + pw.trim();
		$.ajax({
			method: "GET",
			url: loginurl,
		}).done(function( msg ) {
			console.log( "LogIn Response: " + msg["messageType"] + ". " + msg["message"] );
			if(msg["messageType"] == "Login Successful")
			{
				console.log("in new window if statement");
				window.open("patient.html?ambID=" + id, "_self");
			}
			
		});
	});
	
});