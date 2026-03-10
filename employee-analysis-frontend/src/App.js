// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminDashboard from "./Pages/AdminDashboard";
import ManagerDashboard from "./Pages/ManagerDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Tasks from "./Pages/Tasks";
import Employees from "./Pages/Employees";
import Reports from "./Pages/Reports";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Welcome from "./Pages/Welcome"; // Professional welcome page
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
    else setLoggedInUser(null);
  }, []);

  if (loggedInUser === undefined) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Welcome page */}
      <Route path="/" element={<Welcome />} />

      {/* Authentication */}
      <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboards */}
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard user={loggedInUser} />
          </PrivateRoute>
        }
      />
      <Route
        path="/manager-dashboard"
        element={
          <PrivateRoute allowedRoles={["MANAGER"]}>
            <ManagerDashboard user={loggedInUser} />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard user={loggedInUser} />
          </PrivateRoute>
        }
      />

      {/* Other pages */}
      <Route
        path="/tasks"
        element={
          <PrivateRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <Tasks />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute allowedRoles={["ADMIN", "MANAGER"]}>
            <Employees />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <Reports />
          </PrivateRoute>
        }
      />

      {/* Fallback: redirect unknown paths to welcome */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;