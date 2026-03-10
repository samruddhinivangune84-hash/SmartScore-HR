// src/Pages/Employees.js
import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import EmployeesTable from "../components/EmployeesTable"; // create this table

function Employees() {
  return (
    <DashboardLayout>
      <h1>Employees</h1>
      <EmployeesTable />
    </DashboardLayout>
  );
}

export default Employees;