import React from "react";

const DashboardCard = ({ title, value }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
};

export default DashboardCard;