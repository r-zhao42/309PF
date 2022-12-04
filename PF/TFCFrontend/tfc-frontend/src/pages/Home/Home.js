import React from 'react';
import "./Home.css";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
const Home = () => {

  const handleClick = () => {
  };
  
  return (
    <>
    <div className = "bannerdiv">
        <div className = "innerdiv">
            <h1>Welcome to the Toronto Fitness Club</h1>
            <Button variant="primary" onClick={handleClick}>
                Find a Studio Near You
            </Button>
        </div>
    </div>
    </>
    
)
}

export default Home;