import React from "react";
import { Link } from "react-router-dom";

import "./style.css"; // Importar o arquivo CSS para aplicar o estilo

export default function Menu() {
  return (
    <div className="menu">
      <nav>
        <ul>
          <li>
            <Link to="/users">Registro de Usuários</Link>
          </li>
          <li>
            <Link to="/users/add">Formulário de Cadastro</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
