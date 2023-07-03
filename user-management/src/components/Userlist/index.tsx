import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { addDays } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const apiUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/users?page=${currentPage}&size=${usersPerPage}`
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.info("Usuário deletado com sucesso!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        "Não foi possível deletar o usuário. Por favor, tente novamente."
      );
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
                {addDays(new Date(user.dateOfBirth), 1).toLocaleDateString(
                  "pt-BR"
                )}
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

      <ToastContainer />
    </div>
  );
};

export default UserList;
