/*eslint-disable*/
import React from "react";
import TextLoop from "react-text-loop";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/home.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <h1 className="h1-seo" style={{fontWeight: 700, fontSize: "400%"}}>TRIPPIN'</h1>
              come{"  "}
                <TextLoop interval={[850, 850, 3100]}>
                  <span> explore </span>
                  <span>discover</span>
                  <span style={{fontWeight: 700}}>travel</span>
                </TextLoop>{"  "}
                 with us.
          </div>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
