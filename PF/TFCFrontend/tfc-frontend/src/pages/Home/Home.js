import React from 'react';
import "./Home.css";
import NavBar from '../../components/NavBar/NavBar';
const Home = () => {

  const handleClick = () => {
  };
  
  return (
    <>
    <div className = "bannerdiv">
        <div className = "innerdiv">
            <h1>Welcome to the Toronto Fitness Club</h1>
            <button type="button" onClick={handleClick}>
                Discover a Studio Near You
            </button>
        </div>
    </div>
    </>
    
)
}

export default Home;