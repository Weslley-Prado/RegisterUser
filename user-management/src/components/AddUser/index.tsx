import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const AddUser: React.FC = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

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
      .post("http://localhost:8080/api/v1/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  return (
    <div className="container">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="text"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Photo:</label>
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
