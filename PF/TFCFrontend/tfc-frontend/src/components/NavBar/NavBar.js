import {Outlet} from "react-router-dom";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './tfc.png';
import Button from 'react-bootstrap/Button';



const NavBar = () => {
    return (
        <>
            <style type="text/css"> 
            {`
            button {
                margin: 5px;
            }

            .btn-outline-orange {
                background: #fff;
                color: #31548a;
                border: 2px solid #fb6414;
                border-radius: 5px;
                padding: 5px 10px;
              }
            
            .btn-outline-orange:hover {
                background: #fb6414;
                color: #fff;
                border: 2px solid #fb6414;
                border-radius: 5px;
                padding: 5px 10px;
            }
            
            .btn-orange {
                background: #fb6414;
                color: #fff;
                border: 2px solid #fb6414;
                border-radius: 5px;
                padding: 5px 10px;
            }
            
            .btn-orange:hover {
                background: #ce5311;
                color: #fff;
                border: 2px solid #ce5311;
                border-radius: 5px;
                padding: 5px 10px;
            }
            `}
            </style>

            <Navbar bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="#"><img src={logo} height="50" alt="logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#action1">Home</Nav.Link>
                        <Nav.Link href="#action2">Link</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="outline-orange">Login</Button>
                        <Button variant="orange">Sign Up</Button>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>   
    );
  }
  
  export default NavBar;
  