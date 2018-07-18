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
    //console.log(props);
    console.log(typeof props.data.iconDescription )
        
    return (
        <ul className="data-grid">
            {/* Here each piece of the data is mapped to a list element and displayed */}
            <li>{ props.data.city }, { props.data.country }</li>
            <li>Current Temp: { props.data.temp } </li>
            <li>Temperature Range: { props.data.tempMin } - { props.data.tempMax }</li>
            <li> <img src={ props.data.icon }/> </li>
            <li> { props.data.iconDescription.toUpperCase() } </li>
            <li> Humidity: { props.data.humidity } </li>
            <li> Visibility: { (props.data.visibilityMiles / 5280).toFixed(2) } miles</li>
        </ul>
    )
    
}

class DataComponent extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: [ {} ],
            error: "",
            loading: true
        }
        //this.fetchData = this.fetchData.bind(this);
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
        this.setState( {loading: true} );
        fetch(request)
            .then( (response) =>  response.json() )
            .then( (dataObj) => this.setState( 
                {   data: [ {temp: dataObj.main.temp,
                        icon: dataObj.weather[0].icon,
                        iconDescription: dataObj.weather[0].description,
                        tempMin: dataObj.main.temp_min,
                        tempMax: dataObj.main.temp_max,
                        humidity: dataObj.main.humidity,
                        visibilityMiles: dataObj.visibility,
                        city: dataObj.name,
                        country: dataObj.sys.country   
                    } ]
                }
            ) )
            //.then( () => console.log(this.state.data[0]) )
            .then( () => this.setState( { loading: false } ) )
            .catch(error => this.setState( { error, isLoading: false } ) );
}
    composeRequest = (latitude, longitude) => {
    const request = `https://fcc-weather-api.glitch.me/api/current?lat=${latitude}&lon=${longitude}`;
    console.log(request);
    return this.fetchData(request);
    } 

    componentDidMount () {
        this.checkGeo();
        
    }  

    render () {
        return (
            <div>
                {/* <h1>{this.state.temp}</h1> */}
                { this.state.loading === true 
                ? <Loading />
                // Else display a header with the current language and the RepoGrid component
                : <DataGrid data = {this.state.data[0]} />
                
                }
                
            </div>
               
        )
    }
}

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            error: null
            
        }
        
    }

    render () {
        return (
            <div>
                <DataComponent />
            </div>
               
        )
    }
}


ReactDOM.render(
    <App />,

    document.getElementById('root')
);