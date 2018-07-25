



//Component to handle loading states when fetching data:
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        text: 'Loading'
        };
    }
    componentDidMount() {
        const stopAt = this.state.text + '...';
        this.interval = window.setInterval(() => {
        this.state.text === stopAt
            ? this.setState(() => ({ text: 'Loading' }))
            : this.setState((prevState) => ({ text: prevState.text + '.' }))
        }, 300)
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
    }
    render() {
        return (
        <p className = "loading-p">
            {this.state.text}
        </p>
        )
    }
}

function DataGrid(props) {
    return (
        <ul className="data-grid">
            <button onClick={props.handleChildClick}>&deg;{props.mUnits}</button>
            <li>{ props.data.name }, { props.data.sys.country }</li>
            <li >Current Temp: { props.temp } </li>
            <li>Temperature Range: { props.tempMin } - { props.tempMax }</li>
            <li> <img src={ props.data.weather[0].icon }/> </li>
            <li> { props.data.weather[0].description.toUpperCase() } </li>
            <li> Humidity: { props.data.main.humidity } </li>
            <li> Visibility: { (props.data.visibility / 5280).toFixed(2) } miles</li>
        </ul>
    )
    
}

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
    fetchData = (request) => {
        this.setState( {loading: true} );
        fetch(request)
            .then( (response) =>  response.json() )
            .then( (dataObj) => this.setState( 
                {   data: [dataObj],
                    temp: dataObj.main.temp,
                    tempMin: dataObj.main.temp_min,
                    tempMax: dataObj.main.temp_max
                }
            ) )
            .then( () => this.setState( { loading: false } ) )
            .catch(error => this.setState( { error, loading: false } ) );
    }
    composeRequest = (latitude, longitude) => {
        const request = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
        console.log(request);
        return this.fetchData(request);
    }   
    tempChange = () => {
        //if is celsius set temp settings to celsius from data object:
        if (this.state.isCelsius == "F") {
            return this.setState( 
            {   
                temp: this.state.data[0].main.temp, 
                tempMin: this.state.data[0].main.temp_min,
                tempMax: this.state.data[0].main.temp_max,
                isCelsius: "C"
            } )
        }
        else {
            const changeTemp = [this.state.temp, this.state.tempMax, this.state.tempMin].map((acc) => acc * 1.8 + 32)
            //console.log(changeTemp);
            return this.setState({ temp: changeTemp[0].toFixed(2), 
            tempMin: changeTemp[1].toFixed(2),
            tempMax:  changeTemp[2].toFixed(2),
            isCelsius: "F"
        })
        }
        
    }

    render () {
        return (
            <div>
                { this.state.loading === true
                    ? <h1><Loading />
                    <GeoComponent geoCallback = {this.composeRequest}/> </h1> 
                    // Else display a header with the current language and the RepoGrid component
                    : <DataGrid data = {this.state.data[0]} handleChildClick= {this.tempChange} 
                    temp = {this.state.temp} tempMin = {this.state.tempMin} 
                    tempMax = {this.state.tempMax} mUnits = {this.state.isCelsius} /> 
                }
            </div>    
        )
    }
}

class GeoComponent extends React.Component {
    
    
    success = (pos) => {
        var crd = pos.coords;
        //this.setState( {lat: crd.latitude, lon: crd.longitude} )
        this.props.geoCallback(crd.latitude, crd.longitude)
        // console.log('Your current position is:');
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
        //console.log(this.state.lon);
    }
      
    error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    getGeog = (success, error) => { 
        navigator.geolocation.getCurrentPosition(success, error);
        // navigator.geolocation.getCurrentPosition((success, error) => {
        //     this.composeRequest(position.coords.latitude, position.coords.longitude);
        // }) 
    }
    componentDidMount() {
        this.getGeog(this.success, this.error)
    }
    render () {
        return (
            <div>
                
            </div>
               
        )
    }
}


ReactDOM.render(
    <DataComponent />,
    document.getElementById('root')
);