

class App extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: ""
        }
    }
    
    getData = () => console.log("hello");

    render () {
        return (
            <div>
                <h1>{this.getData()}</h1> 
            </div>
               
        )
    }
}




ReactDOM.render(
  <App />,
  document.getElementById('root')
);