CREATE DATABASE IF NOT EXISTS torneos_db;
USE torneos_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'atleta') DEFAULT 'atleta'
);

CREATE TABLE IF NOT EXISTS deportes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS torneos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  ubicacion VARCHAR(255),
  deporte_id INT,
  estado ENUM('abierto', 'en curso', 'finalizado') DEFAULT 'abierto'
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  torneo_id INT,
  atleta_id INT,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resultados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  torneo_id INT,
  atleta_id INT,
  tiempo TIME,
  posicion INT
);

-- Admin inicial
INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Admin', 'admin@correo.com', '$2b$10$F6O3Y0CjMWphYgWB3hoU5e5nFGk3qvRuqAr0H0hjI6llK5amQGZ7e', 'admin');

