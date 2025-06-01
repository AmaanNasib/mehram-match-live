import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";

const IgnoresList = () => {
  const navigate = useNavigate();

  const blockedUsers = [
    {
      id: 59,
      name: "Fatima",
      location: "Mumbai-Maharashtra",
      age: 23,
      occupation: "Software-Designer",
      maritalStatus: "Never Married",
      image: "https://placehold.co/30x30",
      matchPercentage: 80,
    },
    {
      id: 60,
      name: "Ayesha",
      location: "Delhi",
      age: 25,
      occupation: "Doctor",
      maritalStatus: "Never Married",
      image: "https://placehold.co/30x30",
      matchPercentage: 75,
    },
    {
      id: 61,
      name: "Sara",
      location: "Bangalore",
      age: 27,
      occupation: "Engineer",
      maritalStatus: "Divorced",
      image: "https://placehold.co/30x30",
      matchPercentage: 85,
    },
    {
      id: 62,
      name: "Neha",
      location: "Kolkata",
      age: 26,
      occupation: "Artist",
      maritalStatus: "Single",
      image: "https://placehold.co/30x30",
      matchPercentage: 78,
    },
    {
      id: 63,
      name: "Priya",
      location: "Chennai",
      age: 24,
      occupation: "Teacher",
      maritalStatus: "Never Married",
      image: "https://placehold.co/30x30",
      matchPercentage: 82,
    },
  ];

  return (
    <DashboardLayout>
      <div className="match-details-container">
        <h2
          style={{
            fontWeight: "600",
            fontSize: "20px",
            textAlign: "left",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          User Ignored List
        </h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Location</th>
              <th>Occupation</th>
              <th>Marital Status</th>
              <th>Match %</th>
            </tr>
          </thead>
          <tbody>
            {blockedUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => navigate(`/details/${user.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <div className="name-cell">
                    <img src={user.image} alt={user.name} />
                    {user.name}
                  </div>
                </td>
                <td>{user.age}</td>
                <td>{user.location}</td>
                <td>{user.occupation}</td>
                <td>
                  <span
                    className={`status-badge ${user.maritalStatus
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {user.maritalStatus}
                  </span>
                </td>
                <td>{user.matchPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default IgnoresList;
