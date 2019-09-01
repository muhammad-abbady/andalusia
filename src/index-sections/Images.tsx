import * as React from "react";

// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components

function Images() {
  return (
    <>
      <div className="section section-images">
        <Container>
          <Row>
            <Col md="12">
              <div className="hero-images-container">
                <img
                  alt="..."
                  src="https://demos.creative-tim.com/now-ui-kit-react/static/media/hero-image-1.a76c7b4c.png"
                ></img>
              </div>
              <div className="hero-images-container-1">
                <img
                  alt="..."
                  src="https://demos.creative-tim.com/now-ui-kit-react/static/media/hero-image-2.9616730d.png"
                ></img>
              </div>
              <div className="hero-images-container-2">
                <img
                  alt="..."
                  src="https://demos.creative-tim.com/now-ui-kit-react/static/media/hero-image-3.02cd0e2d.png"
                ></img>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Images;
