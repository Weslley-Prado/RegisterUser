import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

interface User {
  id: number;
  code: string;
  name: string;
  dateOfBirth: string;
  photo: string;
  photoUrl: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/users")
      .then((response) => {
        setUsers(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/v1/users/${id}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/edit/${user.id}`}>
              <div className="user-card">
                <img
                  src={`http://localhost:8080/images/${user.photo}`}
                  alt="User Photo"
                />
                <span>{user.code}</span>
                <span>{user.name}</span>
                <span>{user.dateOfBirth}</span>
              </div>
            </Link>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
