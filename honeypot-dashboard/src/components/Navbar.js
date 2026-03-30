import React from "react";

function Navbar() {


  return (
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      padding:"10px 30px",
      backgroundColor:"#1f1f1f",
      color:"#fff"
    }}>
      <div style={{fontWeight:"bold", fontSize:"20px"}}>Honeypot Monitoring System</div>
      
      
    </nav>
  );
}

export default Navbar;