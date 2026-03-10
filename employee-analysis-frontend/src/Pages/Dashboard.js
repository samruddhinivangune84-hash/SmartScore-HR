import React, { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {

    api.get("/employees")
      .then((response) => {
        setEmployeeCount(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });

  }, []);

  return (
    <div style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        <div style={{
          background: "#4CAF50",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          flex: 1
        }}>
          <h3>Total Employees</h3>
          <h1>{employeeCount}</h1>
        </div>

        <div style={{
          background: "#2196F3",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          flex: 1
        }}>
          <h3>Completed Tasks</h3>
          <h1>15</h1>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;