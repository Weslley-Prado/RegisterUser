
# Full Stack Register User


## Estrutura do Projeto

O projeto é dividido em duas partes: o backend e o frontend.

- A pasta `register-user` contém o projeto do backend.
- A pasta `user-management` contém o projeto do frontend.

### Backend

O backend foi desenvolvido em Java utilizando o framework Spring Boot. Ele é responsável por lidar com a lógica de negócio e a persistência de dados.

### Frontend

O frontend foi desenvolvido utilizando ReactJS. Ele é responsável pela interface do usuário e pela interação com o backend.

## Instalação e Configuração

### Backend

1. Certifique-se de ter o Java JDK e o Maven instalados em sua máquina.
2. Navegue até a pasta `register-user`.
3. Execute o seguinte comando para instalar as dependências do projeto:

   `mvn install`

4. Configure as informações de conexão com o banco de dados no arquivo de configuração apropriado.

5. Execute o seguinte comando para iniciar o backend:

   `mvn spring-boot:run`

#### Script SQL Para Criar o Banco
`CREATE DATABASE registeruser /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE user (
  date_of_birth date DEFAULT NULL,
  id bigint NOT NULL AUTO_INCREMENT,
  code varchar(255) DEFAULT NULL,
  name varchar(255) DEFAULT NULL,
  photo varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`

### Frontend

1. Certifique-se de ter o Node.js e o npm instalados em sua máquina.
2. Navegue até a pasta `user-management`.
3. Execute o seguinte comando para instalar as dependências do projeto:
    `npm install`

4. Configure as informações de conexão com o backend no arquivo de configuração apropriado.

5. Execute o seguinte comando para iniciar o frontend:
6. 
   `npm start`

## Contribuição

As contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request com melhorias, correções de bugs ou novos recursos. Certifique-se de seguir as diretrizes de contribuição do projeto.

## Contato

Se você tiver alguma dúvida ou sugestão, entre em contato com [Nome do Contato] em [weslley.prado73@gmail.com](weslley.prado73@gmail.com).
