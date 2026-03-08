import React from "react";
import { Link, useNavigate } from "react-router-dom";//imorting link and useNavbigate from react-router-dim for navigation

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      padding:"10px 30px",
      backgroundColor:"#1f1f1f",
      color:"#fff"
    }}>
      <div style={{fontWeight:"bold", fontSize:"20px"}}>Honeypot Monitoring</div>
      
      <div>
        {!token ? (
          <>
            <Link to="/login"><button style={{margin:"0 5px"}}>Login</button></Link>
            <Link to="/signup"><button style={{margin:"0 5px"}}>Signup</button></Link>
          </>
        ) : (
          <>
            <Link to="/dashboard"><button style={{margin:"0 5px"}}>Dashboard</button></Link>
            <button onClick={handleLogout} style={{margin:"0 5px"}}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;