/**********************************************************************************************
Licensed under the MIT License. See LICENSE file in the project root for license information.
**********************************************************************************************/

import * as React from "react";

// reactstrap components
import { Container } from "reactstrap";

const DarkFooter: React.FC = () => {
  return (
    <footer className="footer" data-background-color="black">
      <Container>
        <nav>
          <ul>
            <li>
              <a href="https://www.creative-tim.com?ref=nukr-dark-footer" target="_blank" rel="noopener noreferrer">
                Creative Tim
              </a>
            </li>
            <li>
              <a
                href="http://presentation.creative-tim.com?ref=nukr-dark-footer"
                target="_blank"
                rel="noopener noreferrer"
              >
                About Us
              </a>
            </li>
            <li>
              <a href="http://blog.creative-tim.com?ref=nukr-dark-footer" target="_blank" rel="noopener noreferrer">
                Blog
              </a>
            </li>
          </ul>
        </nav>
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()}, Designed by{" "}
          <a href="https://www.invisionapp.com?ref=nukr-dark-footer" target="_blank" rel="noopener noreferrer">
            Invision
          </a>
          . Coded by{" "}
          <a href="https://www.creative-tim.com?ref=nukr-dark-footer" target="_blank" rel="noopener noreferrer">
            Creative Tim
          </a>
          .
        </div>
      </Container>
    </footer>
  );
};

export default DarkFooter;
