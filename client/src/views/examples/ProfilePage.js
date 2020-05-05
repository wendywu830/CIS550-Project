import React from "react";
import Typed from 'react-typed';
// reactstrap components


import {
  Button,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Tabs from "./Tabs.js"

  export default class ProfilePage extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        email: '',
        itineraryTabs: []
      }
      this.createItinerary = this.createItinerary.bind(this);
      this.getItineraries = this.getItineraries.bind(this);
    }


    componentWillMount(){
      let email = '';
      console.log(localStorage.getItem('email'))
      if (localStorage && localStorage.getItem('email')) {
        email = JSON.parse(localStorage.getItem('email'));
      }
      this.setState({email: email})
      console.log(this.state.email)
      this.getItineraries(email)
    }
  

    createItinerary(e) {
      e.preventDefault();
      let email = this.state.email
      let name = e.target.name.value

      fetch("http://localhost:8082/addItinerary/" + email + "/" + name,
      {
        method: "GET",
      }).then(res => {
        return res.json();
      }, err => {
        console.log("Error: " + err);
      }).then(result => {
        alert("Itinerary created! Go add some businesses/flights to it!")
        window.location.href = '/search-business'
      });
    }

    getItineraries(email) {
      var itineraries = {}
      fetch("http://localhost:8082/getFlightFromItinByEmail/" + email,
      {
        method: "GET",
      }).then(res => {
        return res.json();
      }, err => {
        console.log("Error: " + err);
      }).then(flight_result => {
        console.log("flight")

        for (let i in flight_result) {
          var elt = flight_result[i]
          if (!itineraries.hasOwnProperty(elt.ITINERARY_ID)) {
            itineraries[elt.ITINERARY_ID] = {flights: [], biz: []}
          }
          itineraries[elt.ITINERARY_ID]['flights'].push(elt)
        }
        fetch("http://localhost:8082/getBusFromItinByEmail/" + email,
        {
          method: "GET",
        }).then(res => {
          return res.json();
        }, err => {
          console.log("Error: " + err);
        }).then(biz_result => {
          console.log(biz_result)
          for (let i in biz_result) {
            var elt = biz_result[i]
            if (!itineraries.hasOwnProperty(elt.ITINERARY_ID)) {
              itineraries[elt.ITINERARY_ID] = {flights: [], biz: []}
            }
            itineraries[elt.ITINERARY_ID]['biz'].push(elt)
          }
          var finalItin = []
          for (let [key, value] of Object.entries(itineraries)) {
            let flightList = value['flights']
            let bizList = value['biz']

            let name = ''
            if (bizList.length === 0) {
              name = flightList[0].ITINERARY_NAME
            } else {
              name = bizList[0].ITINERARY_NAME
            }
            finalItin.push(<Tabs key={key} id={key} name={name} flights={flightList} biz={bizList}></Tabs>)
          
            this.setState({itineraryTabs: finalItin})
          }
          console.log(finalItin)
        });
      });
    }

    render() {    
      return (
        <>
        <IndexNavbar />
        <div className="page-header clear-filter" filter-color="blue">
          <div
            className="page-header-image"
            style={{
              backgroundImage: "url(" + require("assets/img/header2.jpg") + ")"
            }}
          ></div>
          <div className="content">
            <Container>
              
              
              <h3 style={{margin: "6px"}}><b>My Itineraries</b></h3>
              <p><b>
              <Typed
                  typeSpeed={50}
                  backSpeed={50}
                  strings={["Hey there, " +JSON.parse(localStorage.getItem('name')) +"!" , "Let's travel together! ✈️"]}
                  backDelay={1000}
                  loopCount={1}
                  showCursor
                  cursorChar="|"
                />
              </b></p>
              <Form className="form" onSubmit={this.createItinerary}> 
              <Row>
                <Col sm="3">
                </Col>
                <Col sm="5">
                  <InputGroup className={"no-border input-lg" } >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-1_zoom-bold"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="name"
                    placeholder="New Itinerary Name"
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
                  Create New Itinerary
                </Button>
                </Col>       
              </Row>
            </Form>
            <Row>
            {this.state.itineraryTabs.map(tab => <>{tab}</>)}
            </Row>
            </Container>
          </div>
        </div>
        </>
      )
    }
  }