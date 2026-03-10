// src/pages/ManagerDashboard.js
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import axios from "axios";
import "./ManagerDashboard.css";
import { getProductivityScore } from "../api";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [scores, setScores] = useState({});
  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    employeeEmail: "",
    deadline: "",
  });

  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: "", employee: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchLeaves();
  }, []);

  // ======================
  // FETCH TASKS
  // ======================
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks");
      setTasks(res.data);
      fetchScores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // FETCH LEAVES
  // ======================
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/leaves");
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // APPROVE / DENY LEAVE
  // ======================
  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/leaves/${id}/status`, { status });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // FETCH AI SCORES
  // ======================
  const fetchScores = async (taskList) => {
    const scoreMap = {};
    const employees = [...new Set(taskList.map((t) => t.employeeEmail))];
    for (let email of employees) {
      try {
        const res = await getProductivityScore(email);
        scoreMap[email] = res.data;
      } catch (err) {
        scoreMap[email] = 0;
      }
    }
    setScores(scoreMap);
  };

  // ======================
  // FORM INPUT CHANGE
  // ======================
  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ======================
  // ASSIGN / UPDATE TASK
  // ======================
  const assignTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`http://localhost:8080/api/tasks/${editingTask.id}`, form);
        setEditingTask(null);
      } else {
        await axios.post("http://localhost:8080/api/tasks/add", {
          ...form,
          status: "Pending",
        });
      }
      setForm({ title: "", description: "", employeeEmail: "", deadline: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // EDIT TASK
  // ======================
  const editTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      employeeEmail: task.employeeEmail,
      deadline: task.deadline,
    });
  };

  // ======================
  // DELETE TASK
  // ======================
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // UPDATE STATUS
  // ======================
  const updateStatus = async (task, status) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${task.id}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ======================
  // FILTER & SEARCH TASKS
  // ======================
  const filteredTasks = tasks.filter(
    (task) =>
      (filter.status === "" || task.status === filter.status) &&
      (filter.employee === "" || task.employeeEmail.includes(filter.employee)) &&
      (search === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.employeeEmail.toLowerCase().includes(search.toLowerCase()))
  );

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  // ======================
  // CHART DATA
  // ======================
  const taskChartData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Task Status",
        data: [
          tasks.filter((t) => t.status === "Pending").length,
          tasks.filter((t) => t.status === "Completed").length,
        ],
        backgroundColor: ["#ff9800", "#28a745"],
      },
    ],
  };

  const productivityChartData = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: "Employee Productivity Score",
        data: Object.values(scores),
        backgroundColor: "#007bff",
      },
    ],
  };

  return (
    <DashboardLayout role="MANAGER">
      {/* ASSIGN / EDIT TASK */}
      <div className="card">
        <h2>{editingTask ? "Edit Task" : "Assign Task"}</h2>
        <form className="form" onSubmit={assignTask}>
          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            required
          />
          <input
            name="employeeEmail"
            placeholder="Employee Email"
            value={form.employeeEmail}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{editingTask ? "Update Task" : "Assign Task"}</button>
        </form>
      </div>

      {/* SEARCH & FILTER */}
      <h2>Search and Filter</h2>
      <div className="card filter-card">
        <input
          placeholder="Search by title or employee"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          placeholder="Filter by employee email"
          value={filter.employee}
          onChange={(e) => setFilter({ ...filter, employee: e.target.value })}
        />
      </div>

      {/* TASK STATUS CHART */}
      <div className="chart-container">
        <div className="chart-title">Task Completion Analytics</div>
        <Bar data={taskChartData} />
      </div>

      {/* PRODUCTIVITY CHART */}
      <div className="chart-container">
        <div className="chart-title">Employee AI Productivity Analytics</div>
        <Bar data={productivityChartData} />
      </div>

      {/* LEAVE REQUESTS */}
      <div className="card table-card">
        <h2>Employee Leave Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Leave Requests
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employeeEmail}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    {leave.status === "Pending" && (
                      <>
                        <button
                          className="complete-btn"
                          onClick={() => updateLeaveStatus(leave.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => updateLeaveStatus(leave.id, "Denied")}
                        >
                          Deny
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TASK TABLE */}
      <div className="card table-card">
        <h2>Assigned Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Employee</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>AI Score</th>
              <th>Uploaded File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Tasks Assigned
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className={
                    isOverdue(task.deadline) && task.status !== "Completed"
                      ? "overdue"
                      : ""
                  }
                >
                  <td>{task.title}</td>
                  <td>{task.employeeEmail}</td>
                  <td>{task.description}</td>
                  <td>{task.deadline}</td>
                  <td>{task.status}</td>
                  <td>
                    {scores[task.employeeEmail] !== undefined
                      ? scores[task.employeeEmail] + "%"
                      : "Loading..."}
                  </td>
                  <td>
                    {task.completedFile ? (
                      <a
                        href={`http://localhost:8080/api/tasks/${task.id}/file`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    ) : (
                      "Not Uploaded"
                    )}
                  </td>
                  <td className="actions">
                    {task.status === "Pending" && (
                      <button
                        className="complete-btn"
                        onClick={() => updateStatus(task, "Completed")}
                      >
                        Complete
                      </button>
                    )}
                    <button className="edit-btn" onClick={() => editTask(task)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboard;