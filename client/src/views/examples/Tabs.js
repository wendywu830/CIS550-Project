import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Button
} from "reactstrap";

// core components

const Tabs = (props) => {
  const [pills, setPills] = React.useState("1");
  console.log(props)
  return (
    <>
      <Col className="ml-auto mr-auto" md="10" xl="6">
        <Card>
          <CardHeader>
            <Nav
              className="nav-tabs-neutral justify-content-center"
              data-background-color="blue"
              role="tablist"
              tabs
            >
              <NavItem>
                <NavLink
                  className={pills === "1" ? "active" : ""}
                  href="#pablo"
                  onClick={e => {
                    e.preventDefault();
                    setPills("1");
                  }}
                >
                  My Trip
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={pills === "2" ? "active" : ""}
                  href="#pablo"
                  onClick={e => {
                    e.preventDefault();
                    setPills("2");
                  }}
                >
                  Businesses
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={pills === "3" ? "active" : ""}
                  href="#pablo"
                  onClick={e => {
                    e.preventDefault();
                    setPills("3");
                  }}
                >
                  Flights
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody>
            <TabContent
              className="text-center"
              activeTab={"pills" + pills}
              style={{color: '#000000'}}
            >
              <TabPane tabId="pills1">
                <h5>
                  {props.name}
                </h5>
                <a href={"/deleteItinerary/" + props.id}>Delete</a>
              </TabPane>
              <TabPane tabId="pills2">
                <span>
                  <ul>
                    {props.biz.map(b => <li key={b.BUSINESS_NAME}>{b.BUSINESS_NAME}</li>)}
                  </ul>
                </span>
                
              </TabPane>
              <TabPane tabId="pills3">
                <span>
                  {props.flights.map(f => <p>{f.SOURCE_NAME}</p>)}
                </span>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default Tabs;
