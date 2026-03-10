import React from "react";
import { Link } from "react-router-dom";
import "./MainLayout.css";

function MainLayout({ role, children }) {

  const menu = {
    ADMIN: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "Employees", path: "/admin-employees" },
      { name: "Tasks", path: "/admin-tasks" },
      { name: "Reports", path: "/admin-reports" }
    ],

    MANAGER: [
      { name: "Dashboard", path: "/manager-dashboard" },
      { name: "Tasks", path: "/manager-tasks" },
      { name: "Employees", path: "/manager-employees" },
      { name: "Reports", path: "/manager-reports" }
    ],

    EMPLOYEE: [
      { name: "Dashboard", path: "/employee-dashboard" },
      { name: "My Tasks", path: "/employee-tasks" },
      { name: "Leave", path: "/employee-leave" }
    ]
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2 className="logo">Productivity</h2>

        {menu[role].map((item, index) => (
          <Link key={index} to={item.path} className="menu">
            {item.name}
          </Link>
        ))}

      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        <div className="header">
          <h3>{role} Dashboard</h3>

          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
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

export default MainLayout;