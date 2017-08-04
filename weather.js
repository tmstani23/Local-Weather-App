//initialize variables
//url for the JSON request broken into multiple variables here:
var mainBlock = "https://fcc-weather-api.glitch.me/api/current?";
var latBlock = "lat=";
var lonBlock = "&lon=";
var temp;
var isCels = true;
//create user location reference from the HTML
var locElement = document.getElementById("userLoc");
//Get user location:
function getLoc() {
    //if user location is supported:
    if (navigator.geolocation) {
        //get current user location and run showPosition function
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    //else display error message to user
    else {
        locElement.innerHTML = "Geolocation is not supported by this browser.  Activate to continue..."
    }
}
//show user position
function showPosition(position) {
  //create variables that hold the user's latitude and longitude.
  var latitude = position.coords.latitude.toFixed(2);
  var longitude = position.coords.longitude.toFixed(2);
  //Place latitude and longitude on separate lines within the html loc element:
  locElement.innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
  //send latitude and longitude into the getWeather function and run it:
  getWeather(latitude, longitude);
}


//This function makes the JSON request and displays specific data:
function getWeather(lat, long) {
  //concatenate all the variables to make the request string:
  var request = mainBlock + latBlock + lat + lonBlock + long;
  
  //Get the JSON data and save it into a data object:
  $.getJSON(request, function(data) {
    //get user city from the json data
    var city = data.name;
    //get temp-humidity and weather state:
    temp = data.main.temp;
    var humidity =  data.main.humidity;
    var weather = data.weather[0].main;
    //add icon that changes depending on the weather
    var wIcon = data.weather[0].icon;
    
    //add the user city, temp, humid, and weather condition
      //to the correct html element, as a string, and remove any quotation marks:
    $("#userCity").html(JSON.stringify(city).replace(/\"/g, ""));
    $("#temp").html(JSON.stringify("Temperature: " + temp + " " + "&deg;C").replace(/\"/g, ""));
    $("#humidity").html(JSON.stringify("Humidity: " + humidity).replace(/\"/g, ""));
    $("#weather").html(JSON.stringify(weather).replace(/\"/g, ""));
    //change the link reference of weatherImg html element to display icon:
    $('#weatherImg').attr("src", wIcon);
    console.log(request);
    
  });
}

//Function that changes temp from farenheit to celsius:
function calcCels() {
  //if the variable isCels is true:
  if(isCels == true) {
    //modify the temp html element to temperature in deg celsius
    $("#temp").html(JSON.stringify("Temperature: " + temp + " " + "&deg;C").replace(/\"/g, ""));
    //set is Cels to false so next button click will run the farenheit conversion
    return isCels = false;
  }
  //if the variable isCels is false:
  if(isCels == false) {
    //set a tempF variable to hold the conversion of temp from celsius to farenheit
    var tempF = (temp * 1.8 + 32).toFixed(2);
    //modify the temp html element to temp in farenheit
    $("#temp").html(JSON.stringify("Temperature: " + tempF + " " + "&deg;F").replace(/\"/g, ""));
    //set isCels back to true
    return isCels = true;
  }
}    
  


//Run the primary getLoc function that sets off the chain of functions above:
getLoc();