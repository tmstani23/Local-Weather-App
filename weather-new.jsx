//Component to handle loading states when fetching data:
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        text: 'Loading'
        };
    }
    componentDidMount() {
        //Run code within 300 ms interval while component is mounted
        const stopAt = this.state.text + '...'
        this.interval = window.setInterval( () => {
            //Add an "." every interval until "..." is reached
            this.state.text === stopAt
                ? this.setState(() => ( { text: 'Loading' } ) )
                : this.setState((prevState) => ( { text: prevState.text + '.' } ) )
        }, 300)
    }
    componentWillUnmount() {
        //Clear the interval when the component unmounts
        window.clearInterval(this.interval);
    }
    //Render the state's text: ("...")
    render() {
        return (
        <h1 className = "loading">
            {this.state.text}
        </h1>
        )
    }
}
//Component that renders most of the data as JSX html
//The data is passed in as a props object from the DataComponent
function DataGrid(props) {
    return (
        <ul className="data-grid">
            {/* When the temp unit button is clicked a method from the parent DataComponent
            switches temp units and updates its state */}
            
            <li>{ props.data.name }, { props.data.sys.country } </li>
            <li >Current Temp: <strong>{ props.temp } </strong> <button onClick={props.handleChildClick}>&deg;{props.mUnits}</button> </li>
            <li>Temperature Range: <strong>{ props.tempMin } - { props.tempMax }</strong></li>
            <li> <img src={ props.data.weather[0].icon }/> </li>
            <li> { props.data.weather[0].description.toUpperCase() } </li>
            <li> Humidity: <strong>{ props.data.main.humidity }</strong> </li>
            <li> Visibility (miles): <strong>{ (props.data.visibility / 5280).toFixed(2) }</strong> </li>
        </ul>
    )
}
//Main component that handles the data request and temp calculations
class DataComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data: [ {} ],
            tempMin: null,
            tempMax: null,
            error: "",
            loading: true,
            isCelsius: "C"
        }
    }
    //This method fetches the data from the api
    fetchData = (request) => {
        this.setState( {loading: true} );
        fetch(request)
            //Data is saved as a json object
            .then( (response) =>  response.json() )
            //Data object is saved into the component state within a data array
            .then( (dataObj) => this.setState( 
                {   data: [dataObj],
                    //temp values are parsed and saved into separate attributes of the state
                        //so they can be changed without mutating the original data object
                    temp: dataObj.main.temp,
                    tempMin: dataObj.main.temp_min,
                    tempMax: dataObj.main.temp_max
                }
            ) )
            //loading is cancelled and if there's an error the state is updated with the error
            .then( () => this.setState( { loading: false } ) )
            .catch(error => this.setState( { error, loading: false } ) );
    }
    //This function takes the geolocation data and parses it into the request url
    composeRequest = (latitude, longitude) => {
        const request = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
        //The fetchData method is called passing in the request
        return this.fetchData(request);
    }   
    //This method switches between C and F temps and makes the conversion calculation
    tempChange = () => {
        //if is celsius is F set temp settings to celsius from origin data object and reset to C:
        if (this.state.isCelsius === "F") {
            return this.setState( 
            {   
                temp: this.state.data[0].main.temp, 
                tempMin: this.state.data[0].main.temp_min,
                tempMax: this.state.data[0].main.temp_max,
                isCelsius: "C"
            } )
        }
        else {
            //map the current temp and min/max temps into an array and for each one perfocm F conversion calculation
            const changeTemp = [this.state.temp, this.state.tempMax, this.state.tempMin].map((acc) => acc * 1.8 + 32)
            //update the temp attributes of the state and restrict to 2 decimal points
            return this.setState( { temp: changeTemp[0].toFixed(2), 
                tempMin: changeTemp[1].toFixed(2),
                tempMax:  changeTemp[2].toFixed(2),
                isCelsius: "F"
            } )
        }  
    }
    render () {
        return (
            <div>
                {/* if loading render the loading component and geolocation component */}
                { this.state.loading === true
                    ? <div><Loading />
                     {/* Here the composeRequest method is passed as props so it can be used within the GeoComponent */}
                    <GeoComponent geoCallback = {this.composeRequest}/>
                    </div>
                    // Else render the Data Grid component and pass in the data and tempChange method as props
                    : <div><DataGrid data = {this.state.data[0]} handleChildClick= {this.tempChange} 
                    temp = {this.state.temp} tempMin = {this.state.tempMin} 
                    tempMax = {this.state.tempMax} mUnits = {this.state.isCelsius} />
                    </div>
                }
            </div>    
        )
    }
}
//This method handles the geolocation checks and errors
class GeoComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMsg: ""
        }
    }
    //Method used as a callback if the geolocation request is a success
    success = (geoObj) => {
        const coords = geoObj.coords;
        //latitude and longitude are parsed from the returned geolocation object
        //geoCallback method is invoked passing lat/lon to the DataComponent
        this.props.geoCallback(coords.latitude, coords.longitude)
    }
    //Method used if there is an error with the geolocation request  
    error = (err) => {
        //Update the state's error attribute with the error code and message
        this.setState( {errorMsg: `ERROR(${err.code}): ${err.message}`} )
    }
    //Call method that prompts user to accept/deny using their geolocation data
    getGeog = (success, error) => { 
        navigator.geolocation.getCurrentPosition(success, error);
    }
    componentDidMount() {
        this.getGeog(this.success, this.error)
    }
    render () {
        return (
            <div>
               <h3 class="error-div">{this.state.errorMsg}</h3> 
            </div>
               
        )
    }
}

ReactDOM.render(
    <DataComponent />,
    document.getElementById('root')
);