import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from "./components/NavBar/NavBar"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import './App.css';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<NavBar />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />}/>
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
