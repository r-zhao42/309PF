import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar/NavBar"
import Signup from "./pages/Signup/Signup"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import Login from "./pages/Login/Login"
import StudioDetail from "./pages/StudioDetail/StudioDetail"
import Logout from "./pages/Logout/Logout"
import './App.css';


function App() {
  const [ auth, setAuth ] = useState(localStorage.getItem("auth") || 'false')
  const handleChange = (arg) => {
    setAuth(arg)
    localStorage.setItem("auth", arg);
 }
 
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<NavBar loginStatus={auth}/>}>
                <Route index element={<Home />} />
                
                <Route path="home" element={<Home />}/>
                <Route path="signup" element={<Signup setLoginStatus={handleChange}/>} />
                <Route path="profile" element={<Profile />} />
                <Route path="login" element={<Login setLoginStatus={handleChange}/>} />
                <Route path="studio/:name" element={<StudioDetail />} />
                <Route path="logout" element={<Logout setLoginStatus={handleChange}/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
