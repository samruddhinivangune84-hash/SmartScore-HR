import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-overlay">
        <div className="welcome-card">
          <h1>Welcome to SmartScore HR</h1>
          <p>Manage tasks, leaves, and productivity seamlessly.</p>

          <div className="welcome-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;