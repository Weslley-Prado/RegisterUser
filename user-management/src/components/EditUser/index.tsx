import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface User {
  id: number;
  code: string;
  name: string;
  dateOfBirth: string;
  photo: string;
}

const EditUser: React.FC = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/v1/users/${id}`)
      .then((response) => {
        const user = response.data;
        setCode(user.code);
        setName(user.name);
        setDateOfBirth(user.dateOfBirth);
        setPhoto(user.photo);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const updatedUser = {
      code,
      name,
      dateOfBirth,
      photo,
    };

    axios
      .put(`/api/v1/users/${id}`, updatedUser)
      .then((response) => {
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div>
      <h2>Edit User</h2>
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
              type="text"
              value={photo}
              onChange={(event) => setPhoto(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditUser;
