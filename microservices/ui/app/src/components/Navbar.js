import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";

export default class WNavbar extends Component {
  render() {
    return (
      <div id="navbar-div">
        <Navbar
          color="faded"
          className="navbar-dark"
          expand="md"
          id="navbar"
        >
          <NavbarBrand href="/" className="ml-md-5" id="navbar-brand">
            Whizzmap
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }
}
