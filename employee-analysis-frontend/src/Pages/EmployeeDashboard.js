import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getEmployeeTasks, completeTask, getLeaves, applyLeave, getProductivityScore } from "../api";

function EmployeeDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [score, setScore] = useState(0);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
      fetchLeaves();
      fetchProductivity();
    }
  }, [user?.email]);

  const fetchTasks = async () => {
    try {
      const res = await getEmployeeTasks(user.email);
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await getLeaves(user.email);
      setLeaves(res.data);
    } catch (err) {
      console.error("Error loading leaves", err);
    }
  };

  const fetchProductivity = async () => {
    try {
      const res = await getProductivityScore(user.email);
      setScore(res.data);
    } catch (err) {
      console.error("Error loading productivity", err);
    }
  };

  const handleLeaveChange = (e) => setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });

  const submitLeave = async (e) => {
    e.preventDefault();
    try {
      await applyLeave({ ...leaveForm, employeeEmail: user.email });
      alert("Leave submitted successfully");
      setLeaveForm({ startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to submit leave");
    }
  };

  const handleCompleteTask = async (taskId, file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Only PDF files allowed"); return; }
    try {
      await completeTask(taskId, file);
      alert("Task submitted successfully");
      fetchTasks();
      fetchProductivity();
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    }
  };

  return (
    <DashboardLayout role="EMPLOYEE">
      {/* Productivity Card */}
      <div className="card">
        <h3>AI Productivity Score</h3>
        <h1>{score}%</h1>
        {score >= 80 && <p>Excellent Performance</p>}
        {score >= 60 && score < 80 && <p>Good Performance</p>}
        {score < 60 && <p>Needs Improvement</p>}
      </div>

      {/* Tasks Table */}
      <div className="card">
        <h3>Your Tasks</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Description</th><th>Deadline</th><th>Status</th><th>Upload Completion</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan="5">No tasks assigned</td></tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.deadline}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status !== "Completed" ? (
                      <input type="file" accept="application/pdf" onChange={e => handleCompleteTask(task.id, e.target.files[0])} />
                    ) : (<span>Submitted</span>)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Leave Section */}
      <div className="card">
        <h3>Apply for Leave</h3>
        <form onSubmit={submitLeave}>
          <label>Start Date</label>
          <input type="date" name="startDate" value={leaveForm.startDate} onChange={handleLeaveChange} required />
          <label>End Date</label>
          <input type="date" name="endDate" value={leaveForm.endDate} onChange={handleLeaveChange} required />
          <label>Reason</label>
          <textarea name="reason" value={leaveForm.reason} onChange={handleLeaveChange} required />
          <button type="submit">Submit Leave</button>
        </form>

        <h3>Your Leaves</h3>
        <table>
          <thead>
            <tr><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (<tr><td colSpan="4">No leaves applied</td></tr>) :
              leaves.map(leave => (
                <tr key={leave.id}>
                  <td>{leave.startDate}</td><td>{leave.endDate}</td><td>{leave.reason}</td><td>{leave.status}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboard;