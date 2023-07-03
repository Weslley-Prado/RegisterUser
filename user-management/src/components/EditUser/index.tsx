import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css"; // Importe o arquivo CSS

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
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/users/${id}`)
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
      .put(`http://localhost:8080/api/v1/users/${id}`, formData)
      .then((response) => {
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Edit User</h2>
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
          <label htmlFor="code">Code:</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            id="dateOfBirth"
            type="text"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
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
