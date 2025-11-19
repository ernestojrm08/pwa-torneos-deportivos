-- Atleta: atleta@exp.com pass: 123456
-- Administrador: administrador@exp.com pass: 123456
-- Script sql actualizado para la fase 2 del proyecto PWA Torneos Deportivos

DROP DATABASE IF EXISTS torneos_db;
CREATE DATABASE torneos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE torneos_db;

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `deporte_id` int(11) DEFAULT NULL,
  `edad_minima` int(11) DEFAULT NULL,
  `edad_maxima` int(11) DEFAULT NULL,
  `distancia` decimal(10,2) DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `deporte_id`, `edad_minima`, `edad_maxima`, `distancia`, `unidad`, `created_at`) VALUES
(1, '5K Aguas Abiertas', 'Carrera 5km en aguas abiertas', 4, 18, NULL, 5.00, 'kilometros', '2025-11-19 01:58:22'),
(3, 'Infantil A (8-10)', 'Categoría infantil 8-10 años', 5, 8, 10, 25.00, 'metros', '2025-11-19 01:58:22'),
(4, 'Infantil B (11-13)', 'Categoría infantil 11-13 años', 5, 11, 13, 50.00, 'metros', '2025-11-19 01:58:22'),
(5, 'Juvenil A (14-16)', 'Categoría juvenil 14-16 años', 5, 14, 16, 100.00, 'metros', '2025-11-19 01:58:22'),
(6, 'Juvenil B (17-18)', 'Categoría juvenil 17-18 años', 5, 17, 18, 200.00, 'metros', '2025-11-19 01:58:22'),
(7, 'Adultos (19-35)', 'Categoría adultos 19-35 años', 5, 19, 35, 100.00, 'metros', '2025-11-19 01:58:22'),
(8, 'Master (36+)', 'Categoría master +36 años', 5, 36, NULL, 100.00, 'metros', '2025-11-19 01:58:22'),
(9, 'Sprint', 'Triatlón sprint - 750m natación', 6, 18, 39, 750.00, 'metros', '2025-11-19 01:58:22'),
(10, 'Olímpico', 'Triatlón olímpico - 1500m natación', 6, 18, 39, 1500.00, 'metros', '2025-11-19 01:58:22'),
(11, 'Half Ironman', 'Media distancia Ironman', 6, 18, NULL, 1900.00, 'metros', '2025-11-19 01:58:22'),
(12, '5K', 'Carrera 5 kilómetros', 7, 16, NULL, 5.00, 'kilometros', '2025-11-19 01:58:22'),
(13, '10K', 'Carrera 10 kilómetros', 7, 16, NULL, 10.00, 'kilometros', '2025-11-19 01:58:22'),
(14, '21K', 'Media maratón 21km', 7, 18, NULL, 21.10, 'kilometros', '2025-11-19 01:58:22'),
(15, '42K', 'Maratón completo 42km', 7, 18, NULL, 42.20, 'kilometros', '2025-11-19 01:58:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deportes`
--

CREATE TABLE `deportes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `deportes`
--

INSERT INTO `deportes` (`id`, `nombre`, `descripcion`) VALUES
(4, 'Aguas Abiertas', 'Competencias de natación en aguas abiertas'),
(5, 'Natación', 'Competencias de natación en piscina'),
(6, 'Triatlón', 'Competencias de triatlón'),
(7, 'Atletismo', 'Competencias de atletismo'),
(8, 'Atletismo', 'Deporte de pista y campo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `torneo_id` int(11) DEFAULT NULL,
  `atleta_id` int(11) DEFAULT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `torneo_id`, `atleta_id`, `fecha_inscripcion`) VALUES
(13, 19, 3, '2025-11-14 22:34:40'),
(14, 19, 4, '2025-11-14 22:34:40'),
(15, 20, 3, '2025-11-14 22:34:40'),
(16, 21, 4, '2025-11-14 22:34:40'),
(17, 22, 3, '2025-11-14 22:34:40'),
(18, 22, 4, '2025-11-14 22:34:40'),
(19, 20, 4, '2025-11-14 23:16:47'),
(20, 24, 4, '2025-11-18 03:09:24'),
(21, 19, 9, '2025-11-18 03:58:38'),
(22, 21, 9, '2025-11-18 03:58:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id` int(11) NOT NULL,
  `torneo_id` int(11) DEFAULT NULL,
  `atleta_id` int(11) DEFAULT NULL,
  `tiempo` time DEFAULT NULL,
  `posicion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resultados`
--

INSERT INTO `resultados` (`id`, `torneo_id`, `atleta_id`, `tiempo`, `posicion`) VALUES
(8, 19, 2, '90:00:00', 1),
(9, 19, 3, '90:00:00', 2),
(10, 19, 4, '90:00:00', 3),
(11, 20, 4, '40:00:00', 1),
(12, 20, 2, '40:00:00', 2),
(13, 21, 3, NULL, 1),
(14, 21, 4, NULL, 2),
(15, 22, 2, NULL, 1),
(16, 22, 3, NULL, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `torneos`
--

CREATE TABLE `torneos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `deporte_id` int(11) DEFAULT NULL,
  `estado` enum('abierto','en curso','finalizado') DEFAULT 'abierto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `torneos`
--

INSERT INTO `torneos` (`id`, `nombre`, `fecha`, `ubicacion`, `deporte_id`, `estado`) VALUES
(19, 'Torneo de Fútbol Primavera 2024', '2024-06-15', 'Estadio Municipal', 4, 'abierto'),
(20, 'Campeonato Baloncesto Universitario', '2024-06-20', 'Coliseo Deportivo', 5, 'abierto'),
(21, 'Abierto de Tenis Ciudad', '2024-07-01', 'Club de Tenis', 6, 'abierto'),
(22, 'Torneo Voleibol Playa', '2024-06-25', 'Playa Norte', 7, 'en curso'),
(23, 'Torneo de prueba', '2025-11-12', 'Cancha prueba', 4, 'finalizado'),
(24, 'torneo prueba2', '2025-11-17', 'Prueba torneo', 5, 'abierto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','atleta') DEFAULT 'atleta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`) VALUES
(2, 'Atleta Faltante Para Prueba', 'atleta2@ejemplo.com', 'Contraseña improvisada', 'atleta'),
(3, 'Prueba2', 'prueba2@exp.com', '$2b$10$jyYEe5p1jra.8W4ZjqnLquKPaMMU3uuolyhrz0tZCq17wYXrOOxxi', 'admin'),
(4, 'Paola Crespo1', 'pao1@ejemplo.com', '$2b$10$2ryJ/ViJp7TzFCrzuA2HB.rxjC5oH9JqXNGUKlK1muDWtcUNXxEGK', 'atleta'),
(7, 'usuario agregado', 'usuario@exp.com', 'usuario12345', 'atleta'),
(8, 'admin', 'administrador@exp.com', '$2b$10$vypWYICEYt2.yxLymQ5sN.OS4nlkaHy5g8KRy7nsNc.tCNH.jFqOy', 'admin'),
(9, 'atleta', 'atleta@exp.com', '$2b$10$rhDelewheYoQLrEqiCDXLeIgjSKUVjS6HEU7G6jBu.NRrAM1awxqS', 'atleta');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deporte_id` (`deporte_id`);

--
-- Indices de la tabla `deportes`
--
ALTER TABLE `deportes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_torneo_inscripcion` (`torneo_id`),
  ADD KEY `fk_atleta_inscripcion` (`atleta_id`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_torneo_resultado` (`torneo_id`),
  ADD KEY `fk_atleta_resultado` (`atleta_id`);

--
-- Indices de la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_deporte_torneo` (`deporte_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `deportes`
--
ALTER TABLE `deportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `torneos`
--
ALTER TABLE `torneos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`deporte_id`) REFERENCES `deportes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `fk_atleta_inscripcion` FOREIGN KEY (`atleta_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_torneo_inscripcion` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`);

--
-- Filtros para la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `fk_atleta_resultado` FOREIGN KEY (`atleta_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_torneo_resultado` FOREIGN KEY (`torneo_id`) REFERENCES `torneos` (`id`);

--
-- Filtros para la tabla `torneos`
--
ALTER TABLE `torneos`
  ADD CONSTRAINT `fk_deporte_torneo` FOREIGN KEY (`deporte_id`) REFERENCES `deportes` (`id`);
