//initialize variables
//url for the JSON request broken into multiple variables here:
var mainBlock = "https://fcc-weather-api.glitch.me/api/current?";
var latBlock = "lat=";
var lonBlock = "&lon=";
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
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
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
    var temp = data.main.temp;
    var humidity =  data.main.humidity;
    var weather = data.weather[0].main;
    //add icon that changes depending on the weather
    var wIcon = data.weather[0].icon;
    
    //add the user city, temp, humid, and weather condition
      //to the correct html element, as a string, and remove any quotation marks:
    $("#userCity").html(JSON.stringify(city).replace(/\"/g, ""));
    $("#temp").html(JSON.stringify("Temperature: " + temp).replace(/\"/g, ""));
    $("#humidity").html(JSON.stringify("Humidity: " + humidity).replace(/\"/g, ""));
    $("#weather").html(JSON.stringify(weather).replace(/\"/g, ""));
    //change the link reference of weatherImg html element to display icon:
    $('#weatherImg').attr("src", wIcon);
    console.log(wIcon);
  });
}
    
  

//add button that changes f to celsius
//Run the primary getLoc function that sets off the chain of functions above:
getLoc();