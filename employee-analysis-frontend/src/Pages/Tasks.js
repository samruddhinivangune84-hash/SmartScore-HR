// src/Pages/Tasks.js
import React from "react";
import DashboardLayout from "../layout/DashboardLayout";
import TasksTable from "../components/TasksTable"; // your tasks table component

function Tasks() {
  return (
    <DashboardLayout>
      <h1>Tasks</h1>
      <TasksTable />
    </DashboardLayout>
  );
}

export default Tasks;