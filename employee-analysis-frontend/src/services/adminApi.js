import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const adminApi = {
  // Get all managers
  getManagers: () => axios.get(`${BASE_URL}/managers`),

  // Get all employees
  getEmployees: () => axios.get(`${BASE_URL}/employees`),

  // Add user
  addUser: (user) => axios.post(`${BASE_URL}/add-user`, user),

  // Update user
  updateUser: (id, user) => axios.put(`${BASE_URL}/update-user/${id}`, user),

  // Delete user
  deleteUser: (id) => axios.delete(`${BASE_URL}/delete-user/${id}`),
};