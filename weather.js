
//initialize variables

var mainBlock = "http://api.openweathermap.org/data/2.5/weather?";
var apiKey = "&appid=18c30d4b1ac579dfb7cac08e99dc89e9";

var latBlock = "lat=";
var lonBlock = "&lon=";
//get user location

var locElement = document.getElementById("userLoc");

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
    locElement.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
     latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}
//load jquery data
    //example openweather api request:
        //api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=18c30d4b1ac579dfb7cac08e99dc89e9
function getWeather(lat, long) {
  var request = mainBlock + latBlock + lat + lonBlock + long + apiKey;
  
  console.log(request);
  $.getJSON(request, function(data) {
    //data is the JSON string
    //$("#jsonData").html(JSON.stringify(data));
    console.log(data);
  });
}    

    
//temp-humidity
//add button that changes f to celsius
//add icon that changes depending on the weather
getLoc();