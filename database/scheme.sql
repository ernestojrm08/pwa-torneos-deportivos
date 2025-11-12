CREATE DATABASE IF NOT EXISTS torneos_db;
USE torneos_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'atleta') DEFAULT 'atleta'
);

INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Admin', 'admin@correo.com', '$2b$10$Z2oFbAnQJ9tXQZy7rQv7a.3TwhJkzZPIV4K7imCq0S2gW7WqR9Av2', 'admin');
