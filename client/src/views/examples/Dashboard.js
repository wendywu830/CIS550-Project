import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of people.
    this.state = {
      people: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8082/people",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(peopleList => {
      console.log(peopleList)
      // Map each attribute of a person in this.state.people to an HTML element
      let peopleDivs = peopleList.map((person, i) =>
      <div key={i} className="person">
        <div className="email">{person.EMAIL}</div>
        <div className="name">{person.NAME}</div>
        <div className="password">{person.PASSWORD}</div>
      </div>);

      // Set the state of the person list to the value returned by the HTTP response from the server.
      this.setState({
        people: peopleDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  render() {    
    return (
      <div className="Dashboard">
        <div className="container people-container">
          <br></br>
          <div className="jumbotron less-headspace">
            <div className="people-container">
              <div className="people-header">
                <div className="header-lg"><strong>Login</strong></div>
                <div className="header"><strong>Name</strong></div>
                <div className="header"><strong>Birth Year</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.people}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}