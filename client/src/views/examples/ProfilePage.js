import React from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
// reactstrap components


import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  NavbarBrand,
  Navbar,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Tabs from "views/index-sections/Tabs.js"

  export default class SearchPage extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        email: '',
        itineraries: []
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
      this.getItineraries()
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
        console.log("Itin created")
        console.log(result)
      });
    }

    getItineraries() {
      fetch("http://localhost:8082/getFullItineraries/" + this.state.email,
      {
        method: "GET",
      }).then(res => {
        return res.json();
      }, err => {
        console.log("Error: " + err);
      }).then(result => {
        console.log(result)
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
              <h2><b>My Itineraries</b></h2>
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
                  Create
                </Button>
                </Col>       
              </Row>
            </Form>
              <Row>
                <Tabs />
                <Col>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        </>
      )
    }
  }