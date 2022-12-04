import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar/NavBar"
import Signup from "./pages/Signup/Signup"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import './App.css';


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<NavBar />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />}/>
                <Route path="signup" element={<Signup />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
