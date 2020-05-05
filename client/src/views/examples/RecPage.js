import React from "react";
import { MDBDataTable } from 'mdbreact';
// reactstrap components
import Typed from 'react-typed';


import {
  Button,
  UncontrolledTooltip,
  Card,
  CardHeader,
  CardBody,
  TabContent,
  TabPane,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col
} from "reactstrap";

import {FormControl} from "react-bootstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";

  export default class SearchFlightsPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      iconPills: "1",
      email: '',
      itineraryOptions: [],
      categoryVal: '',
      itinValue: '',
      data: []
    }
    // this.submitSearch = this.submitSearch.bind(this);
    this.getItineraries = this.getItineraries.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchLayoverCategory = this.searchLayoverCategory.bind(this)
    this.searchMysteryDest = this.searchMysteryDest.bind(this)
    this.searchFoodDest  = this.searchFoodDest.bind(this)

  }

  addToItinerary(e) {
    e.preventDefault();
    let itinName = e.target[0].value
    let toAddList = []
    const formData = new FormData(e.target);
    console.log()
    for (var [key, value] of formData.entries()) {
      toAddList.push(key)
    }
    console.log(itinName)
    console.log(toAddList)
    fetch("http://localhost:8082/addBusToItin",
    {
      method: "POST",
      body: JSON.stringify({itin_id: itinName, list: toAddList}),
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


  searchMysteryDest(e) {
    e.preventDefault();
    console.log()
    if (e.target.source_city === undefined) return;
    let source_city = e.target.source_city.value;

    fetch("http://localhost:8082/searchMysteryDest/" + source_city,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        var biz_id = elt.B_ID
        resultTable.push({check: <Input type="checkbox" name={biz_id} value={elt.BUSINESS_NAME}/>, 
        business: elt.BUSINESS_NAME, state: elt.STATE, country: elt.COUNTRY, count: elt.COUNT, stars: elt.STARS, direct: "✔"})
      }

      let cols = [
        {
          'label': <pre>      </pre>,
          'field': 'check'
        },
        {
        label: 'State',
        field: 'state',
        sort: 'asc'
      },
      {
        label: 'Country',
        field: 'country',
        sort: 'asc'
      },
      {
        label: "TRIPPIN'™ Approved Business",
        field: 'business',
        sort: 'asc'
      },
      {
        label: "Number of Top Spots",
        field: 'count',
        sort: 'asc'
      },

      {
        label: 'Stars',
        field: 'stars',
        sort: 'asc'
      },{
        label: 'Direct Flight?',
        field: 'direct',
        sort: 'asc'
      }]
      this.setState({
        data: {columns: cols, rows: resultTable}
      }) 
    });
  }

  searchFoodDest(e) {
    e.preventDefault();
    let source_city = e.target.source_city.value;
   
    fetch("http://localhost:8082/searchFoodDest/" + source_city ,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        resultTable.push({ state: elt.STATE, country: elt.COUNTRY, count: elt.BUS_COUNT, direct: "✔"})
      }

      let cols = [
        {
        label: 'State',
        field: 'state',
        sort: 'asc'
      },
      {
        label: 'Country',
        field: 'country',
        sort: 'asc'
      },
      {
        label: 'Count',
        field: 'count',
        sort: 'asc'
      },
      {
        label: 'Direct Flight?',
        field: 'direct',
        sort: 'asc'
      }]
      this.setState({
        data: {columns: cols, rows: resultTable}
      }) 
    });
  }


  searchLayoverCategory(e) {
    e.preventDefault();
    let category = e.target[2].value;
    let source_city = e.target.source_city.value;
    let dest_city = e.target.dest_city.value;
    console.log(category)
    fetch("http://localhost:8082/searchLayoverCategoryBusiness/" + source_city + "/" + dest_city + "/" + category,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        var biz_id = elt.B_ID
        resultTable.push({check: <Input type="checkbox" name={biz_id} value={elt.NAME}/>, 
        business: elt.NAME, layover_city: elt.LAYOVER_CITY, layover_airport: elt.LAYOVER_AIRPORT, layover_country: elt.LAYOVER_COUNTRY, stars: elt.STARS})
      }

      let cols = [
        {
        'label': <pre>      </pre>,
        'field': 'check'
        },
        {
        label: 'Layover City',
        field: 'layover_city',
        sort: 'asc'
      },
      {
        label: 'Layover Airport',
        field: 'layover_airport',
        sort: 'asc'
      },
      {
        label: 'Country',
        field: 'layover_country',
        sort: 'asc'
      },
      {
        label: 'Business',
        field: 'business',
        sort: 'asc'
      },
      {
        label: 'Stars',
        field: 'stars',
        sort: 'asc'
      },]
      this.setState({
        data: {columns: cols, rows: resultTable}
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
    let itinSelector = <> </>;
    if (this.state.iconPills === "1") {
      itinSelector = <Row>
          <Col sm="2">
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
    }

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
          <p><b>
            <Typed
                typeSpeed={50}
                backSpeed={50}
                strings={["Need some help? 🤔", "We're here for you! 🤗", "Explore with us. 🏝"]}
                backDelay={1000}
                loopCount={1}
                showCursor
                cursorChar="|"
              />
          </b></p>
          <Card style={{margin: "0px"}}>
            <CardHeader>
              <Nav className="justify-content-center" role="tablist" tabs style={{padding:"9px"}}>
                <NavItem>
                  <NavLink
                    className={this.state.iconPills === "1" ? "active" : ""}
                    href="#pablo"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({iconPills: "1"});
                    }}
                  >
                    <i className="now-ui-icons travel_istanbul"></i>
                    MYSTERY TRIP
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.iconPills === "2" ? "active" : ""}
                    href="#pablo"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({iconPills: "2"});
                    }}
                  >
                    <i className="now-ui-icons objects_diamond"></i>
                    LAYOVERS
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.iconPills === "3" ? "active" : ""}
                    href="#pablo"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({iconPills: "3"});
                    }}
                  >
                    <i className="now-ui-icons shopping_shop"></i>
                    FOODIE
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={this.state.iconPills === "4" ? "active" : ""}
                    href="#pablo"
                    onClick={e => {
                      e.preventDefault();
                      this.setState({iconPills: "4"});
                    }}
                  >
                    <i className="now-ui-icons ui-2_settings-90"></i>
                    TBD
                  </NavLink>
                </NavItem>
              </Nav>
            </CardHeader>
            <CardBody style={{padding: ".85em"}}>
              <TabContent
                className="text-center"
                activeTab={"iconPills" + this.state.iconPills}
                style={{color: '#000000'}}
              >
                <TabPane tabId="iconPills1">
                  <p>Just feeling spontaneous? Give us your location and we'll tell you the&nbsp; 
                     <span style={{textDecoration: "underline", color:"blue"}} href="#" id="UncontrolledTooltipExample">best</span> place to go!</p>
                  <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipExample">
                    We choose places that are easily accessible from your current location and have the highest rated businesses of popular vacation activities and greatest count of such businesses. 
                    We then give a random <i>TRIPPIN'™ Approved Business</i> to jumpstart your spontaneous journey!
                  </UncontrolledTooltip>
                  <Form className="form" onSubmit={this.searchMysteryDest}>
                    <Row>
                      <Col sm="4">
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
                      <Col sm="1.5">
                        <Button
                          block
                          className="btn-round"
                          color="info"
                          size="sm"
                          type="submit"
                        >
                          Surprise me!
                        </Button >
                      </Col>
                      
                    </Row>
                  </Form>
                </TabPane>
                <TabPane tabId="iconPills2">
                  <p>Want to actually enjoy during your layover? Find the best places to have have your layover with top businesses.</p>
                  <Form className="form" onSubmit={this.searchLayoverCategory}>
                    <Row>
                      <Col sm="4">
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
                      <Col sm="4">
                        <InputGroup className={"no-border input-lg" } >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons ui-1_zoom-bold"></i>
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
                      <FormControl as="select" value={this.state.value} style={{margin: "12px"}}>
                          <option value="Restaurants" name="rest">Restaurants</option>
                          <option value="Shopping" name="shopping">Shopping</option>
                          <option value="Nightlife" name="nightlife">Nightlife</option>
                          <option value="Arts and Entertainment" name="art">Arts and Entertainment</option>
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
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                <TabPane tabId="iconPills3">
                  <p>Traveling for the food? Find the most accessible destination from your city that has the highest rated restaurants.</p>
                  <Form className="form" onSubmit={this.searchFoodDest}>
                    <Row>
                      <Col sm="4">
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
                      <Col sm="1.5">
                        <Button
                          block
                          className="btn-round"
                          color="info"
                          size="sm"
                          type="submit"
                        >
                          Search
                        </Button >
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
                <TabPane tabId="iconPills4">
                  <p></p>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card> 
          <Form className="form" onSubmit={this.addToItinerary}> 
            {itinSelector}
            <MDBDataTable small style={{backgroundColor: 'rgba(228, 236, 232, 0.95)', marginBottom: "90px"}} data={this.state.data}></MDBDataTable>
          </Form>
          </Container>
        </div>
      </div>
    </>
    )
  }
}
