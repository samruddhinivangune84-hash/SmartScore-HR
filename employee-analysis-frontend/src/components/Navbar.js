import React from "react";

const Navbar = () => {

 const user = JSON.parse(localStorage.getItem("user"));

 return (

  <div style={{
    height:"60px",
    background:"#f1f5f9",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"0 20px"
  }}>

    <h3>Employee Analytics</h3>

    <div>
      Welcome {user?.name}
    </div>

  </div>

 );
};

export default Navbar;