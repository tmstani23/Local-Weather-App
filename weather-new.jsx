
// function MakeReq (lat, long) {
//     var mainBlock = "https://fcc-weather-api.glitch.me/api/current?";
//     var latBlock = "lat=";
//     var lonBlock = "&lon=";
   
//     //concatenate all the variables to make the request string:
//   var request = mainBlock + latBlock + lat + lonBlock + long;
// }



class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: ""
        }
    }

    checkGeo = () => { 
        if (navigator.geolocation) {
        //get current user location and run showPosition function
        //navigator.geolocation.getCurrentPosition(getLatitude(position));
            navigator.geolocation.getCurrentPosition((position) => {
                this.composeRequest(position.coords.latitude, position.coords.longitude);
            });
        }
    //else display error message to user
        else {
            console.log("nogeo");
        }
    }
    fetchData = (request) => {
        
        fetch(request)
            .then(function(response) {
                
                return response.json();
            })
            .then(function(myJson) {
                console.log(myJson);
                
            });
        
    }
    composeRequest = (latitude, longitude) => {
    const request = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
    //console.log(request);
    return this.fetchData(request);
    } 

    componentDidMount () {
        this.checkGeo();
    }  

    render () {
        return (
            <div>
                <h1>{this.state.data}</h1> 
            </div>
               
        )
    }
}




ReactDOM.render(
  <App />,
  document.getElementById('root')
);