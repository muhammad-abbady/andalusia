import * as React from "react";

// core components
import IndexNavbar from "./index-sections/IndexNavbar";
import IndexHeader from "./index-sections/IndexHeader";
import DarkFooter from "./index-sections/DarkFooter";

// sections for this page
import Images from "./index-sections/Images";
import BasicElements from "./index-sections/BasicElements";
import Javascript from "./index-sections/Javascript";

function Home() {
  React.useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <IndexHeader />
        <div className="main">
          <Images />
          <BasicElements />
          <Javascript />
        </div>
        <DarkFooter />
      </div>
    </>
  );
}

export default Home;
