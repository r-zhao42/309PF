import {Link, Outlet} from "react-router-dom";
import './NavBar.css'
import React from 'react';
import logo from './tfc.png'
import {NavButton} from "./NavBarElements"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';


const NavBar = () => {
    return (
        <>  

            {/* <nav>
                <img id="logo" src={logo} alt="logo" />
                <NavButton title="Login" titleColor='#2f5491' bgColor='white' to="/login" borderColor='#fd610c'/>
                <NavButton title="Sign Up" titleColor='white' bgColor='#fd610c' to="/signup" borderColor='#fd610c' />
            </nav>      */}
            <Navbar bg="light" expand="lg" fixed="top">
                    <Navbar.Brand href="#home"><img alt="" src={logo} height="60" className="d-inline-block align-top"
            /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"  className="ml-auto"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="#link">Gyms</Nav.Link>
                        <Nav.Link href="#link">Classes</Nav.Link>
                    </Nav>
                    <Nav className="me-2">
                        <NavButton text="Login" />
                        <NavButton text="Sign Up" />
                    </Nav>
                    </Navbar.Collapse>
            </Navbar>
            <Outlet />
        </>   
    );
  }
  
  export default NavBar;
  