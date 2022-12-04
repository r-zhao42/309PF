import React from 'react';
import "../styles/homepage.css";
import NavBar from './NavBar/NavBar';

function Homepage() {

    const handleClick = () => {
        // implementation details
      };
      
    return (
        
        <div className = "bannerdiv">
            <div className = "innerdiv">
                <NavBar />
                {/* <img src={require('../images/lifting.jpg')} alt="gym-banner" className='banner'/> */}
                <h1>Welcome to the Toronto Fitness Club</h1>
                <button type="button" onClick={handleClick}>
                    Join Us
                </button>
            </div>
        </div>
    )
}

export default Homepage;
// https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nm.org%2Fhealthbeat%2Fhealthy-tips%2Ffitness%2Fwomen-who-lift&psig=AOvVaw2DSGDz4ZLHF7-R-EtmKL4z&ust=1669998855254000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJD5jtbs2PsCFQAAAAAdAAAAABAe
// https://www.nm.org//-/media/northwestern/healthbeat/images/healthy-tips/fitness/nm-women-who-lift_feature.jpg