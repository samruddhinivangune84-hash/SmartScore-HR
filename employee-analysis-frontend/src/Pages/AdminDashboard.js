import React, { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import * as API from "../api";

import "./AdminDashboard.css";
import { LayoutDashboard, Users, ClipboardList } from "lucide-react";

function AdminDashboard() {

  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [editingUser, setEditingUser] = useState(null);

  const [taskFilter, setTaskFilter] = useState({ status: "", employee: "" });
  const [taskSearch, setTaskSearch] = useState("");

  const [modalTasks, setModalTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [mgrRes, empRes, taskRes] = await Promise.all([
      API.getManagers(),
      API.getEmployees(),
      API.getTasks(),
    ]);
    setManagers(mgrRes.data);
    setEmployees(empRes.data);
    setTasks(taskRes.data);
  };

  // ===== USER HANDLERS =====
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await API.updateUser(editingUser.id, form);
        setEditingUser(null);
      } else {
        await API.addUser(form);
      }
      setForm({ name: "", email: "", password: "", role: "EMPLOYEE" });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: user.password, role: user.role });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try { await API.deleteUser(id); fetchData(); } catch(err){ console.error(err); }
  };

  // ===== TASK HANDLERS =====
  const markTaskCompleted = async (task) => {
    await API.updateTaskStatus(task.id, "Completed");
    fetchData();
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (taskFilter.status === "" || task.status === taskFilter.status) &&
      (taskFilter.employee === "" || task.employeeEmail.includes(taskFilter.employee)) &&
      (taskSearch === "" || task.title.toLowerCase().includes(taskSearch.toLowerCase()) || task.employeeEmail.toLowerCase().includes(taskSearch.toLowerCase()))
    );
  });

  const isOverdue = (deadline, status) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    return taskDate < today && status !== "Completed";
  };

  // ===== MODAL HANDLER =====
  const openUserTasks = (user) => {
    const userTasks = tasks.filter((t) => t.employeeEmail === user.email);
    setModalTasks(userTasks);
    setModalTitle(`${user.name}'s Tasks`);
    setShowModal(true);
  };

  // ===== DASHBOARD STATS =====
  const totalManagers = managers.length;
  const totalEmployees = employees.length;
  const totalPending = tasks.filter(t => t.status === "Pending").length;
  const totalCompleted = tasks.filter(t => t.status === "Completed").length;

  return (
    <DashboardLayout>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">
        <div className="card"><h4>Total Managers</h4><p>{totalManagers}</p></div>
        <div className="card"><h4>Total Employees</h4><p>{totalEmployees}</p></div>
        <div className="card"><h4>Pending Tasks</h4><p>{totalPending}</p></div>
        <div className="card"><h4>Completed Tasks</h4><p>{totalCompleted}</p></div>
      </div>
      <LayoutDashboard size={18} />

      {/* ADD / EDIT USER */}
      <div className="card">
        <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
        <form onSubmit={saveUser}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleInputChange} required />
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleInputChange} required />
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleInputChange} required />
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleInputChange}>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
          <button type="submit">{editingUser ? "Update User" : "Add User"}</button>
        </form>
      </div>

      {/* MANAGERS TABLE */}
      <div className="card">
        <h3>Managers</h3>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {managers.map(mgr => (
              <tr key={mgr.id}>
                <td onClick={() => openUserTasks(mgr)} style={{ cursor: "pointer", textDecoration:"underline" }}>{mgr.name}</td>
                <td>{mgr.email}</td>
                <td>
                  <button onClick={() => editUser(mgr)}>Edit</button>
                  <button onClick={() => deleteUser(mgr.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPLOYEES TABLE */}
      <div className="card">
        <h3>Employees</h3>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td onClick={() => openUserTasks(emp)} style={{ cursor: "pointer", textDecoration:"underline" }}>{emp.name}</td>
                <td>{emp.email}</td>
                <td>
                  <button onClick={() => editUser(emp)}>Edit</button>
                  <button onClick={() => deleteUser(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TASKS TABLE */}
      <div className="card">
        <h3>All Tasks</h3>
        <div className="task-filters">
          <input placeholder="Search by title or employee" value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} />
          <select value={taskFilter.status} onChange={(e) => setTaskFilter({...taskFilter, status: e.target.value})}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <input placeholder="Filter by employee" value={taskFilter.employee} onChange={(e) => setTaskFilter({...taskFilter, employee: e.target.value})} />
        </div>
        <table>
          <thead>
            <tr><th>Title</th><th>Employee</th><th>Description</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr><td colSpan="6">No tasks found</td></tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id} style={{ color: isOverdue(task.deadline, task.status) ? "red" : "black" }}>
                  <td>{task.title}</td>
                  <td>{task.employeeEmail}</td>
                  <td>{task.description}</td>
                  <td>{task.deadline}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "Pending" && <button onClick={() => markTaskCompleted(task)}>Mark Completed</button>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalTitle}</h3>
            <button className="close" onClick={()=>setShowModal(false)}>X</button>
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Deadline</th></tr></thead>
              <tbody>
                {modalTasks.length === 0 ? (
                  <tr><td colSpan="3">No tasks assigned</td></tr>
                ) : (
                  modalTasks.map(task => (
                    <tr key={task.id} style={{ color: isOverdue(task.deadline, task.status) ? "red" : "black" }}>
                      <td>{task.title}</td>
                      <td>{task.status}</td>
                      <td>{task.deadline}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default AdminDashboard;