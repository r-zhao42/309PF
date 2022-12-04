import React from 'react';
import "./Login.css";
const Login = () => {

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

export default Login;