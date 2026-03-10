import React from "react";
import "../styles/header.css";

function Header() {
  return (
    <div className="header">
      <h3>Employee Productivity Dashboard</h3>
      <div className="profile">
        <span>Admin</span>
      </div>
    </div>
  );
}

export default Header;