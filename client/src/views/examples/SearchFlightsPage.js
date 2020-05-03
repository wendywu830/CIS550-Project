import React from "react";
import { MDBDataTable } from 'mdbreact';
// reactstrap components


import {
  Button,
  Card,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

import {FormControl} from "react-bootstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";

  export default class SearchFlightsPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      itineraryOptions: [],
      itinValue: '',
      rows: [],
      
      columns: [
        {
          label: 'Check',
          field: 'check'
        },
        {
        label: 'Source Airport',
        field: 'source',
        sort: 'asc'
      },
      {
        label: 'Destination Airport',
        field: 'dest',
        sort: 'asc'
      },
      {
        label: 'Airline',
        field: 'airline',
        sort: 'asc'
      },
      {
        label: 'Stops',
        field: 'stops',
        sort: 'asc'
      }],
      data: []
    }
    this.submitSearch = this.submitSearch.bind(this);
    this.getItineraries = this.getItineraries.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  
  submitSearch(e) {
    e.preventDefault();
    let source_city = e.target.source_city.value
    let dest_city = e.target.dest_city.value
    let stops = e.target.stops.value
    fetch("http://localhost:8082/searchFlights/" + source_city + "/" + dest_city + "/" + stops,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {

      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        var route_id = elt.ROUTE_ID
        resultTable.push({check: <Input type="checkbox" name={route_id} value={elt.NAME}/>, 
          source: elt.SOURCE_AIRPORT, dest: elt.DEST_AIRPORT, airline: elt.AIRLINE_NAME, stops: elt.STOPS})
      }

      this.setState({
        data: {columns: this.state.columns, rows: resultTable}
      }) 
    });
  }

  addToItinerary(e) {
    let itinName = e.target[0].value
    let toAddList = []
    const formData = new FormData(e.target);
    e.preventDefault();
    for (var [key, value] of formData.entries()) {
      toAddList.push(key)
    }
    console.log(itinName)
    console.log(toAddList)
    fetch("http://localhost:8082/addFlightToItin",
    {
      method: "POST",
      body: JSON.stringify({itin_id: itinName, route_list: toAddList}),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      alert("Successfully added!")
    });
    
  }

  getItineraries(email) {
    fetch("http://localhost:8082/getCustItineraryNames/" + email,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      let resOptions = result.map((elt, i) => 
        <option value={elt.ITINERARY_ID} name={elt.ITINERARY_ID}>{elt.NAME}</option>
      );
      this.setState({
        itineraryOptions: resOptions
      }) 
    });
  }

  handleChange(event) {
    this.setState({itinValue: event.target.value});
  }

  componentWillMount(){
    let email = '';
    console.log(localStorage.getItem('email'))
    if (localStorage && localStorage.getItem('email')) {
      email = JSON.parse(localStorage.getItem('email'));
    }
    this.setState({email: email})
    this.getItineraries(email)
  }

  render() {    
    return (
      <>
      <IndexNavbar />
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/bg-search.jpg") + ")"
          }}
        ></div>
        <div className="content">
          <Container>
          <Form className="form" onSubmit={this.submitSearch}> 
            <Row>
              <Col>
                <InputGroup className={"no-border input-lg" } >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="now-ui-icons ui-1_zoom-bold"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  name="source_city"
                  placeholder="Source City"
                  type="text"
                  required
                ></Input>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup className={"no-border input-lg" } >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons location_world"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="dest_city"
                    placeholder="Destination City"
                    type="text"
                    required
                  ></Input>
                </InputGroup>
              </Col> 
              <Col sm="2">
                <InputGroup className={"no-border input-lg" } >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="stops"
                    placeholder="Stops"
                    type="number"
                    required
                    min={0} max={5}
                  ></Input>
                </InputGroup>
              </Col>  
              <Col sm="1.5">
               <Button
                block
                className="btn-round"
                color="info"
                size="sm"
                type="submit"
              >
                Search
              </Button>
              </Col>       
            </Row>
            </Form>
          </Container>
          <Container>
          <Form className="form" onSubmit={this.addToItinerary}> 
            <Row>
              <Col sm="2" >
              <FormControl as="select" value={this.state.value} onChange={this.handleChange} style={{margin: "12px"}}>
                {this.state.itineraryOptions}
              </FormControl>
              </Col>
                
              <Col sm="1.5">
              <Button
                  block
                  className="btn-round"
                  color="info"
                  size="sm"
                  type="submit"
                >
                  Add 
                </Button>
              </Col>
            </Row>
        
            <Card className="card-login card-plain">
              <MDBDataTable small style={{backgroundColor: 'rgba(228, 236, 232, 0.95)', marginBottom: "90px"}} data={this.state.data}>
              </MDBDataTable>
            </Card>
          </Form>
          </Container>
        </div>
      </div>
    </>
    )
  }
}
