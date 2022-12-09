import {Outlet} from "react-router-dom";
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './tfc.png';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import '../Button/button.css';



const NavBar = ({loginStatus}) => {

        return (
            <>
                <style type="text/css"> 
                {`
                button {
                    margin: 5px;
                }
    
                .btn-outline-orange {
                    background: #f5f5f5;
                    color: #31548a;
                    border: 2px solid #fdebe2;
                    border-radius: 5px;
                    padding: 5px 10px;
                  }
                
                .btn-outline-orange:hover {
                    background: #e85f15;
                    color: #fff;
                    border: 2px solid #e85f15;
                    border-radius: 5px;
                    padding: 5px 10px;
                }
                
                .btn-outline-orange:active {
                    background: #d25715 !important;
                    color: #fff !important;
                    border: 2px solid #d25715 !important;
                    border-radius: 5px !important;
                    padding: 5px 10px !important;
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
    
                .btn-orange:active {
                    background: #a1420f !important;
                    color: #fff !important;
                    border: 2px solid #a1420f !important;
                    border-radius: 5px !important;
                    padding: 5px 10px !important;
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
                .account-drop {
                    background: #f5f5f5;
                    color: #31548a;
                    border: 2px solid #fdebe2;
                    border-radius: 5px;
                    padding: 5px 10px;
            
                  }
                
                  .account-drop:hover {
                    background: #f5f5f5;
                    color: #31548a;
                    border: 2px solid #fdebe2;
                    border-radius: 5px;
                    padding: 5px 10px;
                  }
                  .account-drop:active   {
                    background: #d25715 !important;
                    color: #fff !important;
                    border: 2px solid #d25715 !important;
                    border-radius: 5px !important;
                    padding: 5px 10px !important;
                  }

                  .drop-item {
                    background: #f5f5f5;
                    color: #31548a;
                    border-radius: 5px;
                    padding: 5px 10px;
                  }
                  
                  .drop-item:hover{
                    background: #f5f5f5;
                    color: #31548a;
                    border-radius: 5px;
                    padding: 5px 10px;
                  }

                  .drop-item:active   {
                    background: #f5f5f5 !important;
                    color: #31548a  !important;
                    border-radius: 5px  !important;
                    padding: 5px 10px  !important;
                  }
                  .drop {
                    background: #f5f5f5;
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
                            <Nav.Link href="/home" className="nav-item">Home</Nav.Link>
                            <Nav.Link href="/studio-search" className="nav-item">Gyms</Nav.Link>
                            <Nav.Link href="/subscription" className="nav-item">Subscription</Nav.Link>
                        </Nav>
                        <Nav>
                            { loginStatus === 'true' ? 
                            <>
                            
                            <Dropdown className='dropdown'>
                                <Dropdown.Toggle className="account-drop">
                                    My Account
                                </Dropdown.Toggle>

                                <Dropdown.Menu className='drop'>
                                    <Dropdown.Item href="/profile" className='drop-item'>View Profile</Dropdown.Item>
                                    <Dropdown.Item href="/subscription" className='drop-item'>Edit Subscription</Dropdown.Item>
                                    <Dropdown.Item href="/logout" className='drop-item'>Log out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            </>
                            :
                            <>
                            <Nav.Link href="/login"><Button variant="orange">Log In</Button></Nav.Link>
                            <Nav.Link href="/signup"><Button variant="outline-orange">Sign Up</Button></Nav.Link></>}
                            
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Outlet />
            </>   
        );
    
  }
  
  export default NavBar;
  