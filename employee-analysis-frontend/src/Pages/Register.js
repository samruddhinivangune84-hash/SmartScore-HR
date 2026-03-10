import React, { useState } from "react";
import * as API from "../api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    await API.addUser(user);
    alert("Registration Successful");

    navigate("/login");

  } catch (error) {

    console.error(error);
    alert("Registration Failed");

  }
};
  

  return (
  <div className="auth-container">

    <div className="auth-card">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <label>Name</label>
        <input name="name" onChange={handleChange} required />

        <label>Email</label>
        <input name="email" onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" onChange={handleChange} required />

        <label>Role</label>
        <select name="role" onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>

        <button type="submit">Register</button>

      </form>

      <div className="auth-switch">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </div>

    </div>

  </div>
);
}

export default Register;