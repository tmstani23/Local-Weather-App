
// function MakeReq (lat, long) {
//     var mainBlock = "https://fcc-weather-api.glitch.me/api/current?";
//     var latBlock = "lat=";
//     var lonBlock = "&lon=";
   
//     //concatenate all the variables to make the request string:
//   var request = mainBlock + latBlock + lat + lonBlock + long;
// }

function DataGrid(props) {
    return (
        <h1>{props.temperature}</h1>
    )
    
}

class DataComponent extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            temp: "",
            icon: "",
            iconDescription: "",
            tempMin: "",
            tempMax: "",
            humidity: "",
            visibilityMiles: "",
            city: "",
            country: "",
            error: null,
            isLoading: false
        }
        this.fetchData = this.fetchData.bind(this);
    }

    checkGeo = () => { 
        if (navigator.geolocation) {
        //get current user location and run showPosition function
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
        //console.log(request);
        this.setState( {isLoading: true} );
        fetch(request)
            .then( (response) =>  response.json() )
            .then( (dataObj) => this.setState( 
                {   temp: dataObj.main.temp,
                    icon: dataObj.weather[0].icon,
                    iconDescription: dataObj.weather[0].description,
                    tempMin: dataObj.main.temp_min,
                    tempMax: dataObj.main.temp_max,
                    humidity: dataObj.main.humidity,
                    visibilityMiles: dataObj.visibility,
                    city: dataObj.name,
                    country: dataObj.sys.country,
                    error: "Failed to connect to api.",
                } 
            ) )
            //.then( () => console.log(this.state) )
            .catch(error => this.setState( { error, isLoading: false } ) );
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
                {/* <h1>{this.state.temp}</h1> */}
                <DataGrid temperature = {this.state.temp} />
            </div>
               
        )
    }
}

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoading: false
        }
        
    }

    render () {
        return (
            <div>
                {/* <h1>{this.state.city}</h1>  */}
                <DataComponent />
            </div>
               
        )
    }
}


ReactDOM.render(
    <App />,

    document.getElementById('root')
);