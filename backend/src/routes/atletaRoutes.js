import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Obtener datos del perfil del atleta
router.get('/perfil', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Inscripciones del atleta
    const [inscripciones] = await db.execute(`
      SELECT i.id, t.nombre as torneo, t.fecha, t.ubicacion, 
             d.nombre as deporte, i.fecha_inscripcion,
             CASE 
               WHEN t.estado = 'abierto' THEN 'Inscrito'
               WHEN t.estado = 'en curso' THEN 'En progreso'
               ELSE 'Finalizado'
             END as estado
      FROM inscripciones i
      JOIN torneos t ON i.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE i.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [userId]);

    // 2. Resultados del atleta
    const [resultados] = await db.execute(`
      SELECT r.id, t.nombre as torneo, r.posicion, t.fecha, t.ubicacion,
             d.nombre as deporte
      FROM resultados r
      JOIN torneos t ON r.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE r.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [userId]);

    // 3. Torneos disponibles (donde el atleta NO está inscrito)
    const [torneosDisponibles] = await db.execute(`
      SELECT t.id, t.nombre, t.fecha, t.ubicacion, t.estado,
             d.nombre as deporte,
             (SELECT COUNT(*) FROM inscripciones i2 WHERE i2.torneo_id = t.id) as inscritos_actuales,
             20 as cupos_maximos  -- Puedes cambiar esto según tu lógica de negocio
      FROM torneos t
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE t.estado = 'abierto' 
        AND t.id NOT IN (
          SELECT torneo_id FROM inscripciones WHERE atleta_id = ?
        )
      ORDER BY t.fecha ASC
    `, [userId]);

    res.json({
      inscripciones: inscripciones.map(ins => ({
        ...ins,
        cupos_disponibles: 20 - ins.inscritos_actuales
      })),
      resultados,
      torneosDisponibles: torneosDisponibles.map(t => ({
        id: t.id,
        nombre: t.nombre,
        fecha: t.fecha,
        ubicacion: t.ubicacion,
        deporte: t.deporte,
        cupos: Math.max(0, t.cupos_maximos - t.inscritos_actuales),
        estado: t.estado
      }))
    });

  } catch (err) {
    console.error('❌ Error en perfil atleta:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Inscribirse en un torneo
router.post('/inscribirse/:torneoId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { torneoId } = req.params;

    // Verificar si ya está inscrito
    const [existing] = await db.execute(
      'SELECT id FROM inscripciones WHERE atleta_id = ? AND torneo_id = ?',
      [userId, torneoId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya estás inscrito en este torneo' });
    }

    // Verificar cupos disponibles
    const [[torneo]] = await db.execute(
      `SELECT t.*, 
              (SELECT COUNT(*) FROM inscripciones WHERE torneo_id = t.id) as inscritos_actuales
       FROM torneos t WHERE t.id = ?`,
      [torneoId]
    );

    if (!torneo) {
      return res.status(404).json({ message: 'Torneo no encontrado' });
    }

    const cuposMaximos = 20; // Puedes cambiar esto
    if (torneo.inscritos_actuales >= cuposMaximos) {
      return res.status(400).json({ message: 'No hay cupos disponibles' });
    }

    // Realizar inscripción
    await db.execute(
      'INSERT INTO inscripciones (atleta_id, torneo_id) VALUES (?, ?)',
      [userId, torneoId]
    );

    res.status(201).json({ message: 'Inscripción exitosa' });

  } catch (err) {
    console.error('❌ Error en inscripción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;