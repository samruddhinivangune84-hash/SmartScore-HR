// src/pages/Productivity.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Productivity() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ marginLeft: "220px", padding: "20px" }}>Loading...</p>;
  if (error) return <p style={{ marginLeft: "220px", padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ marginLeft: "220px", padding: "20px" }}>
      <h2>Employee Productivity</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Employee</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Task</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{task.employeeName}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{task.title}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {task.completed ? "Completed" : "Pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productivity;