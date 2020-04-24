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

  export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      columns: [{
        label: 'Business Name',
        field: 'name',
        sort: 'asc'
      },
      {
        label: 'Address',
        field: 'address',
        sort: 'asc'
      },
      {
        label: 'Stars',
        field: 'stars',
        sort: 'asc'
      }]
    }
    this.submitSearch = this.submitSearch.bind(this);
  }

  
  submitSearch(e) {
    e.preventDefault();
    let city = e.target.city.value
    let state = e.target.state.value
    let stars = e.target.stars.value
    console.log(state)
    fetch("http://localhost:8082/search/" + city + "/" + state + "/" + stars,
    {
      method: "GET",
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      console.log(result)
      // let resultTable = result.map((biz, i) => 
      //   <tr>
      //     <td>{biz.NAME}</td>
      //     <td>{biz.ADDRESS}</td>
      //     <td>{biz.STARS}</td> 
      //   </tr>
      // ); //add categories to table later in nicer representation
      var resultTable = []
      for (let ind in result) {
        var elt = result[ind]
        resultTable.push({name: elt.NAME, address: elt.ADDRESS, stars: elt.STARS})
      }

      //This saves our HTML representation of the data into the state, which we can call in our render function
			this.setState({
				searchResults: resultTable
      });
      console.log(resultTable)
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
                  name="city"
                  placeholder="City"
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
                    name="state"
                    placeholder="State"
                    type="text"
                    required
                  ></Input>
                </InputGroup>
              </Col>   
              <Col sm="2">
                <InputGroup className={"no-border input-lg" } >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="now-ui-icons ui-2_favourite-28"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="stars"
                    placeholder="Min Stars"
                    type="number"
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
            <Card className="card-login card-plain">
              <CardHeader className="text-center">
                <h4 className="card-title" >Results</h4>
              </CardHeader>
              <CardBody>
              <MDBTable scrollY maxHeight="50vh" style={{backgroundColor: 'rgba(228, 236, 232, 0.95)'}}>
                <MDBTableHead columns={this.state.columns} />
                <MDBTableBody rows={this.state.searchResults} />
              </MDBTable>
              </CardBody>
            </Card>
          </Container>
        </div>
      </div>
    </>
    )
  }
}
