// src/layout/DashboardLayout.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout({ children, role }) {
  const location = useLocation();

  // Role-based menus
  const menusByRole = {
    ADMIN: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "Tasks", path: "/tasks" },
      { name: "Employees", path: "/employees" },
      { name: "Reports", path: "/reports" },
    ],
    MANAGER: [
      { name: "Dashboard", path: "/manager-dashboard" },
      { name: "Tasks", path: "/tasks" },
      { name: "Employees", path: "/employees" },
      { name: "Reports", path: "/reports" },
    ],
    EMPLOYEE: [
      { name: "Dashboard", path: "/employee-dashboard" },
      { name: "Tasks", path: "/tasks" },
      { name: "Reports", path: "/reports" },
    ],
  };

  const menu = menusByRole[role] || [];

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">{role} Panel</div>
        <nav className="menu">
          {menu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        <div className="topbar">
          <h2>{role} Dashboard</h2>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;