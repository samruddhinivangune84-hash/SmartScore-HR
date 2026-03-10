import React from "react";
import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="sidebar">

<h2>HR System</h2>

<h4>Dashboard</h4>
<Link to="/manager">Manager Dashboard</Link>

<h4>Tasks</h4>
<Link to="/assign-task">Assign Task</Link>
<Link to="/view-tasks">View Tasks</Link>

<h4>Employees</h4>
<Link to="/team">My Team</Link>

<h4>Reports</h4>
<Link to="/productivity">Productivity</Link>

</div>

);

{user.role === "ADMIN" && (
  <>
    <li><Link to="/admin-dashboard">Dashboard</Link></li>
    <li><Link to="/employees">Employees</Link></li>
    <li><Link to="/managers">Managers</Link></li>
    <li><Link to="/reports">Reports</Link></li>
  </>
)}

}

export default Sidebar;