import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      .post("http://localhost:8080/api/v1/users", formData)
      .then((response) => {
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Code:
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Date of Birth:
            <input
              type="text"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Photo:
            <input
              type="file"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
            />
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddUser;
