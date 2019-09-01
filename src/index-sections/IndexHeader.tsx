import * as React from "react";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current!.style.transform =
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
            backgroundImage:
              "url(https://demos.creative-tim.com/now-ui-kit-react/static/media/header.ffcc99c4.jpg)"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <img
              alt="..."
              className="n-logo"
              src="data:image/png;base64,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"
            ></img>
            <h1 className="h1-seo">Now UI Kit.</h1>
            <h3>A beautiful Bootstrap 4 UI kit. Yours free.</h3>
          </div>
          <h6 className="category category-absolute">
            Designed by{" "}
            <a href="http://invisionapp.com/?ref=creativetim" target="_blank">
              <img
                alt="..."
                className="invision-logo"
                src="https://demos.creative-tim.com/now-ui-kit-react/static/media/invision-white-slim.300494e9.png"
              ></img>
            </a>
            . Coded by{" "}
            <a
              href="https://www.creative-tim.com?ref=nukr-index-header"
              target="_blank"
            >
              <img
                alt="..."
                className="creative-tim-logo"
                src="https://demos.creative-tim.com/now-ui-kit-react/static/media/creative-tim-white-slim2.f7cb2d39.png"
              ></img>
            </a>
            .
          </h6>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
