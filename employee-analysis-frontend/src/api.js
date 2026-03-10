import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// USERS / ADMIN
export const getManagers = () => API.get("/admin/managers");
export const getEmployees = () => API.get("/admin/employees");
export const addUser = (user) => API.post("/admin/add-user", user);
export const updateUser = (id, user) => API.put(`/admin/update-user/${id}`, user);
export const deleteUser = (id) => API.delete(`/admin/delete-user/${id}`);

// TASKS
export const getTasks = () => API.get("/tasks");
export const getEmployeeTasks = (email) =>
  API.get(`/tasks/employee/${email.toLowerCase()}`);
export const addTask = (task) =>
  API.post("/tasks/add", { ...task, employeeEmail: task.employeeEmail.toLowerCase() });
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const updateTaskStatus = (id, status) => API.put(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// TASK COMPLETION
export const completeTask = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post(`/tasks/${id}/complete`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// LEAVES
export const applyLeave = (leave) => API.post("/leaves/apply", leave);
export const getLeaves = (email) => API.get(`/leaves/employee/${email.toLowerCase()}`);
export const updateLeaveStatus = (id, status) => API.put(`/leaves/${id}/status`, { status });

// PRODUCTIVITY
export const getProductivityScore = (email) =>
  API.get(`/analytics/productivity/${email.toLowerCase()}`);