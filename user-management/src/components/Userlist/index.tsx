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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [usersPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/users?page=${currentPage}&size=${usersPerPage}`
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/users/edit/${id}`);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="user-list-container">
      <h2>Bem vindo ao Registro de Usuários</h2>
      <ul className="user-list">
        <li className="user-list-header">
          <span>Imagem</span>
          <span>Código</span>
          <span>Nome</span>
          <span>Data de Nascimento</span>
        </li>
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-card">
              <img
                src={`http://localhost:8080/images/${user.photo}`}
                alt="User Photo"
              />
              <span className="no-underscore">{user.code}</span>
              <span className="no-underscore">{user.name}</span>
              <span className="no-underscore">
                {new Date(user.dateOfBirth).toLocaleDateString("pt-BR")}
              </span>
              <div className="user-card-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(user.id)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span className="page-number">{currentPage + 1}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
