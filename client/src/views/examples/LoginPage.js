import React from "react";

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
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. 
    // This component maintains the list of people.
    this.state = {
      people: []
    }
  }
  

  submitLogin(e) {
    e.preventDefault();

    fetch("http://localhost:8082/checklogin/" + e.target.email.value + "/" + e.target.password.value,
    {
      method: 'GET',
    }).then(res => {
      return res.json();
    }, err => {
      console.log("Error: " + err);
    }).then(result => {
      //alert(result.length); 
      if (result.length === 1) {
        window.location.href = "/"
      } else {
        window.location.href = "/login"
      }
    });
  }

  navbarColor = ""
  render() {
    return (
      <>
      <Navbar className={"fixed-top navbar-transparent"} expand="lg" color="info">
          <Container>
            <div className="navbar-translate">
              <NavbarBrand
                href="/home"
                id="navbar-brand"
              >
                Home
              </NavbarBrand>
            </div>
            </Container>
        </Navbar> 
        <div className="page-header clear-filter" filter-color="blue">
          <div
            className="page-header-image"
            style={{
              backgroundImage: "url(" + require("assets/img/login.jpg") + ")"
            }}
          ></div>
          <div className="content">
            <Container>
              <Col className="ml-auto mr-auto" md="4">
                <Card className="card-login card-plain">
                  <Form className="form" onSubmit={this.submitLogin}>
                    <CardHeader className="text-center">
                      <h1 className="h1-seo" style={{fontWeight: 700, fontSize: "300%"}}>TRIPPIN'</h1>
                    </CardHeader>
                    <CardBody>
                      <InputGroup
                        className={
                          "no-border input-lg" 
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_email-85"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          name="email"
                          placeholder="Email"
                          type="email"
                        ></Input>
                      </InputGroup>
                      <InputGroup
                        className={
                          "no-border input-lg"
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_lock-circle-open"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="password"
                          name="password"
                        ></Input>
                      </InputGroup>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        block
                        className="btn-round"
                        color="info"
                        size="lg"
                        type="submit"
                      >
                        LOGIN
                      </Button >
                      <div className="pull-left">
                        <h6>
                          <a
                            className="link"
                            href="/sign-up"
                            
                          >
                            No account? sign up
                          </a>
                        </h6>
                      </div>
                      
                    </CardFooter>
                  </Form>
                </Card>
              </Col>
            </Container>
          </div>
        </div>
      </>
    );
  }
}
