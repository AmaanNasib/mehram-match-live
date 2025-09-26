import React from 'react';
import { Link } from 'react-router-dom';
import "./header.css";

const MainNav = () => {
  return (
    <nav className="main-nav">
      <div className="logo">
        <img src="https://placehold.co/150x50" alt="Mehram Match" className="logo-img" />
      </div>
      <div className="nav-links">
        <Link to="/newdashboard" className="active">HOME</Link> 
        <Link to="#">Hello</Link>
        {/* <Link to="#">PREMIUM PLANS</Link> */}
        {/* <Link to="/guidance">GUIDANCE</Link> */}
        <Link to="/contact-us">CONTACT US</Link>
      </div>
    </nav>
  );
};

export default MainNav;