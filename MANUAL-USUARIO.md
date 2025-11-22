*** Descripción general ***

Sistema de Torneos Deportivos es una aplicación web que permite la gestión integral de torneos deportivos, donde existen dos tipos principales de usuarios:

Administrador: crea, edita, elimina torneos y gestiona deportes, categorías y participantes.

Atleta: puede registrarse, iniciar sesión, ver los torneos disponibles e inscribirse en ellos.

El sistema está compuesto por:

Frontend: desarrollado con React + Vite + Material UI.

Backend: desarrollado con Node.js + Express + MySQL2.

Base de datos: MySQL, con tablas para usuarios, torneos, deportes, categorías e inscripciones.

Autenticación: basada en JWT (JSON Web Tokens).

 Las instrucciones para instalar y ejecutar el proyecto se encuentran en el archivo README.md.


*** 2. Acceso al sistema ***
🔹 Ingreso al sistema

Abrir la aplicación desde el navegador.

Iniciar sesión con un correo y contraseña válidos.

Según el rol del usuario, se mostrará uno de los siguientes paneles:

Administrador: vista de gestión.

Atleta: vista de perfil e inscripciones.

🔹 Registro de usuario

El registro de atletas se realiza desde el formulario “Registrarse”.

El administrador puede registrar nuevos usuarios manualmente en la base de datos o mediante los endpoints de la API.

*** 3. Estructura general del sistema ***
Módulo	Descripción
Login y Registro	Permite iniciar sesión o crear una cuenta nueva.
Dashboard Administrador	Vista general con estadísticas y torneos.
Gestión de Torneos	Crear, editar, eliminar y listar torneos.
Gestión de Deportes	CRUD de deportes disponibles.
Gestión de Categorías	Definición de categorías por edad o nivel.
Gestión de Inscripciones (Atleta)	Ver torneos disponibles e inscribirse.
Perfil de Usuario	Ver y editar información personal.
Sidebar de Navegación	Menú lateral adaptado al rol del usuario.


⚙️ 4. Funcionalidades por rol

*** ADMINISTRADOR ***

Menú principal: 

Dashboard: resumen de torneos y estadísticas.

Torneos: gestión completa (crear, editar, eliminar, ver lista).

Deportes: gestión de los deportes registrados.

Categorías: mantenimiento de categorías por torneo.

Usuarios: visualización y administración de atletas.

Acciones:

Crear torneo → botón “Nuevo Torneo”.

Editar torneo → ícono de lápiz ✏️.

Eliminar torneo → ícono de basura 🗑️.

Ver detalles → clic en el nombre del torneo.

*** ATLETA ***

Menú principal:

Mi Perfil: muestra los datos personales.

Torneos Disponibles: lista de torneos activos con cupos.

Mis Inscripciones: muestra los torneos en los que está inscrito.

Acciones:

Ver torneos disponibles → lista con nombre, fecha, ubicación y deporte.

Inscribirse → botón “Inscribirse”.

Cancelar inscripción → botón “Cancelar”.

Consultar los torneos en los que ya participa.

***  5. Base de datos principal ***

Tablas más relevantes:

Tabla	Campos principales
usuarios	id, nombre, correo, contraseña, rol
deportes	id, nombre
torneos	id, nombre, fecha, ubicacion, deporte_id, estado, cupos_totales
categorias	id, torneo_id, nombre, edad_minima, edad_maxima
inscripciones	id, torneo_id, usuario_id, categoria_id, estado, fecha_inscripcion

***  6. Endpoints principales (API) ***
🔹 Autenticación
Método	Endpoint	            Descripción
POST	/api/auth/login	       Inicia sesión.
POST	/api/auth/register	     Crea nuevo atleta.
🔹 Torneos
Método	       Endpoint	                               Descripción
GET	       /api/torneos/admin	                 Lista todos los torneos (solo admin).
POST	    /api/torneos/admin	                 Crea un nuevo torneo.
PUT	      /api/torneos/:id	                     Edita torneo existente.
DELETE	/api/torneos/admin/:id	                      Elimina un torneo.
GET	  /api/torneos/atleta/torneos-disponibles	    Lista torneos activos con cupos.
🔹 Inscripciones (Atleta)
Método	         Endpoint	                                       Descripción
GET	    /api/atleta/inscripciones	                Lista inscripciones del atleta.
POST	/api/atleta/inscribirse/:id	           Inscribe al atleta en un torneo.
DELETE	/api/atleta/inscripciones/:id	               Cancela inscripción.


💻 7. Instrucciones de uso

*** Para el administrador: ***

Iniciar sesión con cuenta de rol admin.

Desde el sidebar, entrar a Torneos.

Crear nuevos torneos con los datos requeridos (nombre, fecha, ubicación, deporte, cupos).

Editar o eliminar torneos según sea necesario.

Consultar inscripciones o reportes.

*** Para el atleta: ***

Iniciar sesión con una cuenta de rol atleta.

Consultar los torneos disponibles en su dashboard.

Hacer clic en “Inscribirse” para un torneo activo.

Confirmar la inscripción.

Ver el listado en Mis Inscripciones y cancelar si es necesario.

*** 8. Requisitos técnicos ***
Componente	Versión mínima
Node.js	18.x
MySQL	8.x
React	18+
Vite	Última estable
Material UI	5.x