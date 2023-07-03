import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { convertDateFormat } from "../AddUser";

interface User {
  id: number;
  code: string;
  name: string;
  dateOfBirth: string;
  photo: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [formattedDateOfBirth, setFormattedDateOfBirth] = useState("");
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

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/${id}`)
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        setCode(userData.code);
        setName(userData.name);
        setFormattedDateOfBirth(
          format(parseISO(userData.dateOfBirth), "dd/MM/yyyy")
        );
        setPhoto(null);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleDateOfBirthChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formattedDate = formatDateString(event.target.value);
    setDateOfBirth(formattedDate);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(dateOfBirth);
    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("dateOfBirth", convertDateFormat(dateOfBirth));
    if (photo) {
      formData.append("photo", photo);
    }

    axios
      .put(`${apiUrl}/users/${id}`, formData)
      .then((response) => {
        toast.success("Usuário atualizado com sucesso!");
        setTimeout(() => {
          navigate("/users");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error(
          "Não foi possível atualizar o usuário. Por favor, tente novamente."
        );
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Atualizar Usuário</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="photo" className="photo-label">
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="user-photo preview-photo"
              />
            )}
            {!photo && user.photo && (
              <img
                src={`http://localhost:8080/${user.photo}`}
                alt="User Photo"
                className="user-photo"
              />
            )}
            <div className="file-button">Trocar Foto</div>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="code">Código:</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">
            Data de Nascimento:{formattedDateOfBirth}
          </label>
          <input
            id="dateOfBirth"
            type="text"
            value={dateOfBirth}
            onChange={handleDateOfBirthChange}
          />
        </div>

        <button type="submit" className="save-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
