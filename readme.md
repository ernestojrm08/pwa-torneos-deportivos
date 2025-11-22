#  PWA Torneos Deportivos-

Proyecto académico desarrollado en React, Vite, Node.js y MySQL para la administración de torneos multideportivos.

##  Estructura del Proyecto
- `/frontend` --- Aplicación cliente (React + Vite)
- `/backend` --- Servidor API REST (Node + Express)
- `/database` --- Scripts SQL
- `/docs` --- Documentación SCRUM y manual técnico

Antes de iniciar el servidor asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MySQL / XAMPP](https://www.apachefriends.org/)
- [Postman](https://www.postman.com/) (opcional para probar endpoints)

---
1. Instalar dependencias: 
npm install

2. Variables de entorno (.env):

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=torneos_db
JWT_SECRET=superclavejwt2025
PORT=3000

3. Configurar database desde XAMPP_

Abre phpMyAdmin y ejecuta el script database/base-de-datos-final.sql desde el proyecto.

4. Ejecución del servidor

Split terminal 
En un terminal: cd frontend
En otro terminal: cd backend

Npm run dev en ambos.

**Tecnologías usadas**

Node.js – entorno de ejecución

Express.js – framework backend

MySQL2 – conexión a base de datos

dotenv – manejo de variables de entorno

bcrypt – cifrado de contraseñas

jsonwebtoken (JWT) – autenticación segura

nodemon – recarga automática en desarrollo