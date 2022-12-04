import React from 'react';
import "../../styles/home.css";
import NavBar from '../../components/NavBar/NavBar';

const Home = () => {
  const handleClick = () => {
    // implementation details
  };
  
return (
    
    <div className = "bannerdiv">
        <div className = "innerdiv">
            {/* <NavBar /> */}
            {/* <img src={require('../images/lifting.jpg')} alt="gym-banner" className='banner'/> */}
            <h1>Welcome to the Toronto Fitness Club</h1>
            <button type="button" onClick={handleClick}>
                Join Us
            </button>
        </div>
    </div>
)
}

export default Home;