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
                background: #ce5311;
                color: #fff;
                border: 2px solid #ce5311;
                border-radius: 5px;
                padding: 5px 10px;
            }
            
            .btn-orange:hover {
                background: #b74a10;
                color: #fff;
                border: 2px solid #b74a10;
                border-radius: 5px;
                padding: 5px 10px;
            }

            .color-nav {
                background-color: #fb6414;
            }

            .nav-item {
                display: inline-block;
                position: relative;
                color: white;
            }

            .nav-item:hover {
                color: white;
            }
              
            .nav-item::after {
                content: '';
                position: absolute;
                width: 100%;
                transform: scaleX(0);
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: white;
                transform-origin: bottom right;
                transition: transform 0.25s ease-out;
              }
              
            .nav-item:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }
            
            `}
            </style>

            <Navbar className="color-nav" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="#"><img src={logo} height="50" alt="logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="#action1" className="nav-item">Home</Nav.Link>
                        <Nav.Link href="#action2" className="nav-item">Gyms</Nav.Link>
                        <Nav.Link href="#action2" className="nav-item">Classes</Nav.Link>
                        <Nav.Link href="#action2" className="nav-item">Membership</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="orange">Login</Button>
                        <Button variant="outline-orange">Sign Up</Button>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>   
    );
  }
  
  export default NavBar;
  