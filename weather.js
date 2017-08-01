
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
}
//load jquery data
//temp-humidity
//add button that changes f to celsius
//add icon that changes depending on the weather