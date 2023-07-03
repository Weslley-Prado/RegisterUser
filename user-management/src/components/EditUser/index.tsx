import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format, parse, addDays } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

interface User {
  id: number;
  code: string;
  name: string;
  dateOfBirth: string;
  photo: string;
}

const convertDateFormat = (dateString: string) => {
  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
  return format(parsedDate, "yyyy-MM-dd");
};

const EditUser: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

  useEffect(() => {
    axios
      .get(`${apiUrl}/users/${id}`)
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        setCode(userData.code);
        setName(userData.name);
        setDateOfBirth(userData.dateOfBirth);
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
    const enteredDate = event.target.value;
    const formattedDate = enteredDate
      .replace(/\//g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2");
    setDateOfBirth(formattedDate);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("dateOfBirth", dateOfBirth);
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

  const formattedDate = addDays(
    new Date(user.dateOfBirth),
    1
  ).toLocaleDateString("pt-BR");

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
          <label htmlFor="dateOfBirth">Data de Nascimento:</label>
          <input
            id="dateOfBirth"
            type="text"
            value={formattedDate}
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
