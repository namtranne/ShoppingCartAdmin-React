import logo from "./../images/shopping-logo.png";
import React from "react";
import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
export const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <a href="/" className="navbar-brand">
          <img src={logo} alt="" width="100px" />
        </a>
        <div className="collapse navbar-collapse" id="topNavbar">
          <Nav className="me-auto">
            <NavDropdown title="Users" id="basic-nav-dropdown">
              <NavDropdown.Item href="/user/create">
                Create New
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/users">View All</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Category" id="basic-nav-dropdown">
              <NavDropdown.Item href="/category/create">
                Create New
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/categories">View All</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </div>
      </nav>
    </div>
  );
};

export const Footer = () => {
  return (
    <div className="text-center m3">
      <p>Shopping Cart Control Panel - Coppyright &copy; ShoppingCart</p>
    </div>
  );
};
