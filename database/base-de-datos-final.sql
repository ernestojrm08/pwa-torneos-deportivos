-- Atleta: atleta@exp.com pass: 123456
-- Administrador: administrador@exp.com pass: 123456

DROP DATABASE IF EXISTS torneos_db;
CREATE DATABASE torneos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE torneos_db;

CREATE TABLE `deportes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `deportes`
--

INSERT INTO `deportes` (`id`, `nombre`, `descripcion`) VALUES
(4, 'Fútbol', 'Deporte de equipo con balón'),
(5, 'Baloncesto', 'Deporte de canasta'),
(6, 'Tenis', 'Deporte de raqueta'),
(7, 'Voleibol', 'Deporte de equipo con red'),
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
(13, 19, 3, '2025-11-14 18:34:40'),
(14, 19, 4, '2025-11-14 18:34:40'),
(15, 20, 3, '2025-11-14 18:34:40'),
(16, 21, 4, '2025-11-14 18:34:40'),
(17, 22, 3, '2025-11-14 18:34:40'),
(18, 22, 4, '2025-11-14 18:34:40'),
(19, 20, 4, '2025-11-14 19:16:47'),
(20, 24, 4, '2025-11-17 23:09:24'),
(21, 19, 9, '2025-11-17 23:58:38'),
(22, 21, 9, '2025-11-17 23:58:40');

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
-- AUTO_INCREMENT de la tabla `deportes`
--
ALTER TABLE `deportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
