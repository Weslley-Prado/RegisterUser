import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const AddUser: React.FC = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

  const formatDateString = (value: string) => {
    const dateNumbers = value.replace(/\D/g, "").substring(0, 8);
    if (dateNumbers.length >= 5) {
      return `${dateNumbers.substring(0, 2)}/${dateNumbers.substring(
        2,
        4
      )}/${dateNumbers.substring(4, 8)}`;
    } else if (dateNumbers.length >= 3) {
      return `${dateNumbers.substring(0, 2)}/${dateNumbers.substring(2, 4)}`;
    } else {
      return dateNumbers;
    }
  };

  const handleDateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedDate = formatDateString(event.target.value);
    setDateOfBirth(formattedDate);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("dateOfBirth", convertDateFormat(dateOfBirth));
    if (photo) {
      formData.append("photo", photo);
    }

    axios
      .post(`${apiUrl}/users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Usuário cadastrado com sucesso!");

        setTimeout(() => {
          navigate("/users");
        }, 2000); // Tempo de atraso em milissegundos (2 segundos neste exemplo)
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        toast.error(
          "Não foi possível cadastrar o usuário. Por favor, tente novamente."
        );
      });
  };

  return (
    <div className="container">
      <ToastContainer />
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Código:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Data de Nascimento:</label>
          <input
            type="text"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={handleDateInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Foto:</label>
          <div className="add-photo-button">
            <label htmlFor="photo" className="add-photo-label">
              Choose Photo
            </label>
            <input
              type="file"
              id="photo"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
            {photo && <span>{photo.name}</span>}
          </div>
        </div>

        <button type="submit">Criar usuário</button>
      </form>
    </div>
  );
};

export default AddUser;

export const convertDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  const formattedDate = format(parsedDate, "yyyy-MM-dd");
  return formattedDate;
};
