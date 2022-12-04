import {Outlet} from "react-router-dom";
import React from 'react';

const NavBar = () => {
    return (
        <>
            <nav>
                <p>test</p>
            </nav>
            <Outlet />
        </>   
    );
  }
  
  export default NavBar;
  
  