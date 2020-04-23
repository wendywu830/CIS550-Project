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

import TransparentFooter from "components/Footers/TransparentFooter.js";




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
          <TransparentFooter />
        </div>
      </>
    );
  }
}



// function submitLogin(e) {
//   // e.preventDefault()
//   // console.log(e.target.email.value)
//   // console.log(e.target.password.value)

//   fetch("http://localhost:8082/people",
//   {
//     method: "POST",
//     body: JSON.stringify({email: e.target.email.value, password: e.target.password.value}),
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       'Accept': 'application/json, text/plain, */*',
//       'Content-Type': 'application/json'
//     }
//   }).then(res => {
//     console.log(res.json())
//     return res.json();
//   }, err => {
//     console.log("Error: " + err);
//     alert("err")
//   }).then(result => {
//     alert("hi"); 
//     // if (result.status === "ok") {
//     //   alert("hi" + result.status);
//     // } 
//   });
// }


// function submitLogin(e) {

//   fetch("http://localhost:8082/checklogin/" + e.target.email.value + "/" + e.target.password.value,
//   {
//     method: 'GET',
//   }).then(res => {
//     return res.json();
//   }, err => {
//     console.log("Error: " + err);
//   }).then(result => {
//     alert(result); 
//   });
// }

// function LoginPage() {
  // const [firstFocus, setFirstFocus] = React.useState(false);
  // const [lastFocus, setLastFocus] = React.useState(false);
  // const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");

//   React.useEffect(() => {
//     document.body.classList.add("login-page");
//     document.body.classList.add("sidebar-collapse");
//     document.documentElement.classList.remove("nav-open");
//     window.scrollTo(0, 0);
//     document.body.scrollTop = 0;
//     return function cleanup() {
//       document.body.classList.remove("login-page");
//       document.body.classList.remove("sidebar-collapse");
//     };
//   });


//   return (
//     <>
//     <Navbar className={"fixed-top " + navbarColor} expand="lg" color="info">
//         <Container>
//           <div className="navbar-translate">
//             <NavbarBrand
//               href="/home"
//               target="_blank"
//               id="navbar-brand"
//             >
//               Home
//             </NavbarBrand>
//           </div>
//           </Container>
//       </Navbar> 
//       <div className="page-header clear-filter" filter-color="blue">
//         <div
//           className="page-header-image"
//           style={{
//             backgroundImage: "url(" + require("assets/img/login.jpg") + ")"
//           }}
//         ></div>
//         <div className="content">
//           <Container>
//             <Col className="ml-auto mr-auto" md="4">
//               <Card className="card-login card-plain">
//                 <Form className="form" onSubmit={submitLogin}>
//                   <CardHeader className="text-center">
//                     <h1 className="h1-seo" style={{fontWeight: 700, fontSize: "300%"}}>TRIPPIN'</h1>
//                   </CardHeader>
//                   <CardBody>
//                     <InputGroup
//                       className={
//                         "no-border input-lg" +
//                         (firstFocus ? " input-group-focus" : "")
//                       }
//                     >
//                       <InputGroupAddon addonType="prepend">
//                         <InputGroupText>
//                           <i className="now-ui-icons ui-1_email-85"></i>
//                         </InputGroupText>
//                       </InputGroupAddon>
//                       <Input
//                         name="email"
//                         placeholder="Email"
//                         type="email"
//                         onFocus={() => setFirstFocus(true)}
//                         onBlur={() => setFirstFocus(false)}
//                       ></Input>
//                     </InputGroup>
//                     <InputGroup
//                       className={
//                         "no-border input-lg" +
//                         (firstFocus ? " input-group-focus" : "")
//                       }
//                     >
//                       <InputGroupAddon addonType="prepend">
//                         <InputGroupText>
//                           <i className="now-ui-icons ui-1_lock-circle-open"></i>
//                         </InputGroupText>
//                       </InputGroupAddon>
//                       <Input
//                         placeholder="Password"
//                         type="password"
//                         name="password"
//                         onFocus={() => setFirstFocus(true)}
//                         onBlur={() => setFirstFocus(false)}
//                       ></Input>
//                     </InputGroup>
//                   </CardBody>
//                   <CardFooter className="text-center">
//                     <Button
//                       block
//                       className="btn-round"
//                       color="info"
//                       size="lg"
//                       type="submit"
//                     >
//                       LOGIN
//                     </Button >
//                     <div className="pull-left">
//                       <h6>
//                         <a
//                           className="link"
//                           href="/sign-up"
                          
//                         >
//                           No account? sign up
//                         </a>
//                       </h6>
//                     </div>
                    
//                   </CardFooter>
//                 </Form>
//               </Card>
//             </Col>
//           </Container>
//         </div>
//         <TransparentFooter />
//       </div>
//     </>
//   );
// }

//export default LoginPage;
