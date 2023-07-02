import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/Userlist";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/users">User List</Link>
            </li>
            <li>
              <Link to="/users/add">Add User</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
