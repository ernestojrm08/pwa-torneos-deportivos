-- INSERCIÓN DE DATOS DE PRUEBA!
-- Este script inserta datos de prueba en las tablas deportes, usuarios, torneos, inscripciones y resultados.

-- A. Insertar DEPORTES (IDs 4, 5, 6, 7, 8)
INSERT INTO deportes (id, nombre, descripcion) VALUES 
(4, 'Fútbol', 'Deporte de equipo con balón'),
(5, 'Baloncesto', 'Deporte de canasta'),
(6, 'Tenis', 'Deporte de raqueta'),
(7, 'Voleibol', 'Deporte de equipo con red'),
(8, 'Atletismo', 'Deporte de pista y campo');


-- B. Insertar USUARIOS (IDs 2, 3, 4)
INSERT INTO usuarios (id, nombre, email, password, rol) VALUES 
(2, 'Atleta Test', 'atleta2@prueba.com', 'HASH_DEL_ATLETA', 'atleta'),
(3, 'Prueba2', 'prueba2@exp.com', 'HASH_DEL_ADMIN1', 'admin'),
(4, 'diego aguilar', 'diegoaguilar@ejemplo.com', 'HASH_DEL_ADMIN2', 'admin');


-- C. Insertar TORNEOS (IDs 19, 20, 21, 22)
INSERT INTO torneos (id, nombre, fecha, ubicacion, deporte_id, estado) VALUES 
(19, 'Torneo de Fútbol Primavera 2024', '2024-06-15', 'Estadio Municipal', 4, 'abierto'),
(20, 'Campeonato Baloncesto Universitario', '2024-06-20', 'Coliseo Deportivo', 5, 'abierto'),
(21, 'Abierto de Tenis Ciudad', '2024-07-01', 'Club de Tenis', 6, 'abierto'),
(22, 'Torneo Voleibol Playa', '2024-06-25', 'Playa Norte', 7, 'en curso');


-- D. Insertar INSCRIPCIONES
INSERT INTO inscripciones (torneo_id, atleta_id) VALUES 
(19, 2), (19, 3), (19, 4), 
(20, 4), (20, 2),          
(21, 3), (21, 4),          
(22, 2), (22, 3), (22, 4); 


-- E. Insertar RESULTADOS
INSERT INTO resultados (torneo_id, atleta_id, tiempo, posicion) VALUES 
(19, 2, '90:00', 1), (19, 3, '90:00', 2), (19, 4, '90:00', 3),
(20, 1, '40:00', 1), (20, 2, '40:00', 2),
(21, 3, NULL, 1), (21, 4, NULL, 2),
(22, 2, NULL, 1), (22, 3, NULL, 2);


-- 3. ACTIVAR COMPROBACIONES
-- Volver a activar las comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;