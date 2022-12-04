import React from 'react';
import {useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Home.css";


const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/replace-this');
      };
    
  
  return (
    <>
    <div className = "outer-div">
        <div className = "inner-div">
            <h1 className = 'home-title'>Welcome to the Toronto Fitness Club</h1>
            <br/>
            <Button variant="home" onClick={handleClick}>
                Find a Studio Near You
            </Button>
        </div>
    </div>
    </>
)
}

export default Home;