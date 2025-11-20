import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Obtener datos del perfil del atleta
router.get('/perfil', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Inscripciones del atleta (MEJORADO con categorías)
    const [inscripciones] = await db.execute(`
      SELECT i.id, t.nombre as torneo, t.fecha, t.ubicacion, 
             d.nombre as deporte, i.fecha_inscripcion, i.estado,
             c.nombre as categoria,
             CASE 
               WHEN t.estado = 'abierto' THEN 'Inscrito'
               WHEN t.estado = 'en curso' THEN 'En progreso'
               ELSE 'Finalizado'
             END as estado_torneo
      FROM inscripciones i
      JOIN torneos t ON i.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON i.categoria_id = c.id
      WHERE i.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [userId]);

    // 2. Resultados del atleta (MEJORADO con categorías)
    const [resultados] = await db.execute(`
      SELECT r.id, t.nombre as torneo, r.posicion, r.tiempo, t.fecha, t.ubicacion,
             d.nombre as deporte, c.nombre as categoria
      FROM resultados r
      JOIN torneos t ON r.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON r.categoria_id = c.id
      WHERE r.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [userId]);

    // 3. Torneos disponibles (MEJORADO con categorías disponibles)
    const [torneosDisponibles] = await db.execute(`
      SELECT t.id, t.nombre, t.fecha, t.ubicacion, t.estado, t.deporte_id,
             d.nombre as deporte,
             (SELECT COUNT(*) FROM inscripciones i2 WHERE i2.torneo_id = t.id) as inscritos_actuales,
             20 as cupos_maximos
      FROM torneos t
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE t.estado = 'abierto' 
        AND t.id NOT IN (
          SELECT torneo_id FROM inscripciones WHERE atleta_id = ?
        )
      ORDER BY t.fecha ASC
    `, [userId]);

    // 4. Obtener categorías para cada torneo disponible
    const torneosConCategorias = await Promise.all(
      torneosDisponibles.map(async (torneo) => {
        const [categorias] = await db.execute(`
          SELECT id, nombre, descripcion, edad_minima, edad_maxima, distancia, unidad
          FROM categorias 
          WHERE deporte_id = ?
          ORDER BY nombre
        `, [torneo.deporte_id]);

        return {
          id: torneo.id,
          nombre: torneo.nombre,
          fecha: torneo.fecha,
          ubicacion: torneo.ubicacion,
          deporte: torneo.deporte,
          cupos: Math.max(0, torneo.cupos_maximos - torneo.inscritos_actuales),
          estado: torneo.estado,
          categorias_disponibles: categorias
        };
      })
    );

    res.json({
      inscripciones: inscripciones.map(ins => ({
        ...ins,
        cupos_disponibles: 20 // Mantener consistencia
      })),
      resultados,
      torneosDisponibles: torneosConCategorias
    });

  } catch (err) {
    console.error('❌ Error en perfil atleta:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Inscribirse en un torneo (ACTUALIZADO con categorías)
router.post('/inscribirse/:torneoId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { torneoId } = req.params;
    const { categoria_id } = req.body; // ✅ NUEVO: aceptar categoría

    console.log(`📝 Atleta ${userId} intentando inscribirse en torneo ${torneoId}, categoría: ${categoria_id}`);

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
       FROM torneos t WHERE t.id = ? AND t.estado = 'abierto'`,
      [torneoId]
    );

    if (!torneo) {
      return res.status(404).json({ message: 'Torneo no encontrado o no está abierto' });
    }

    const cuposMaximos = 20;
    if (torneo.inscritos_actuales >= cuposMaximos) {
      return res.status(400).json({ message: 'No hay cupos disponibles' });
    }

    // ✅ NUEVO: Validar categoría si se proporciona
    if (categoria_id) {
      const [categoria] = await db.execute(
        `SELECT c.* FROM categorias c
         JOIN torneos t ON t.deporte_id = c.deporte_id
         WHERE c.id = ? AND t.id = ?`,
        [categoria_id, torneoId]
      );
      
      if (categoria.length === 0) {
        return res.status(400).json({ message: 'La categoría no es válida para este torneo' });
      }
    }

    // Realizar inscripción (ACTUALIZADO con categoría)
    await db.execute(
      'INSERT INTO inscripciones (atleta_id, torneo_id, categoria_id) VALUES (?, ?, ?)',
      [userId, torneoId, categoria_id || null]
    );

    console.log(`✅ Inscripción exitosa para atleta ${userId} en torneo ${torneoId}`);
    res.status(201).json({ message: 'Inscripción exitosa' });

  } catch (err) {
    console.error('❌ Error en inscripción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ NUEVO: Obtener inscripciones del atleta
router.get('/inscripciones', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [inscripciones] = await db.execute(`
      SELECT i.id, i.fecha_inscripcion, i.estado,
             t.id as torneo_id, t.nombre as torneo_nombre, t.fecha, t.ubicacion, t.estado as torneo_estado,
             d.nombre as deporte_nombre,
             c.id as categoria_id, c.nombre as categoria_nombre
      FROM inscripciones i
      JOIN torneos t ON i.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON i.categoria_id = c.id
      WHERE i.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [userId]);

    res.json(inscripciones);
  } catch (err) {
    console.error('❌ Error obteniendo inscripciones:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ NUEVO: Cancelar inscripción
router.delete('/inscripciones/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que la inscripción pertenece al atleta
    const [inscripcion] = await db.execute(
      'SELECT id FROM inscripciones WHERE id = ? AND atleta_id = ?',
      [id, userId]
    );

    if (inscripcion.length === 0) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    await db.execute('DELETE FROM inscripciones WHERE id = ?', [id]);
    
    res.json({ message: 'Inscripción cancelada exitosamente' });
  } catch (err) {
    console.error('❌ Error cancelando inscripción:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ NUEVO: Obtener torneos disponibles con más detalles
router.get('/torneos-disponibles', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [torneos] = await db.execute(`
      SELECT t.id, t.nombre, t.fecha, t.ubicacion, t.estado, t.deporte_id,
             d.nombre as deporte_nombre, d.descripcion as deporte_descripcion,
             (SELECT COUNT(*) FROM inscripciones i2 WHERE i2.torneo_id = t.id) as inscritos_actuales,
             20 as cupos_maximos
      FROM torneos t
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE t.estado = 'abierto' 
        AND t.id NOT IN (
          SELECT torneo_id FROM inscripciones WHERE atleta_id = ?
        )
      ORDER BY t.fecha ASC
    `, [userId]);

    // Enriquecer con categorías disponibles
    const torneosEnriquecidos = await Promise.all(
      torneos.map(async (torneo) => {
        const [categorias] = await db.execute(`
          SELECT id, nombre, descripcion, edad_minima, edad_maxima, distancia, unidad
          FROM categorias 
          WHERE deporte_id = ?
          ORDER BY nombre
        `, [torneo.deporte_id]);

        return {
          ...torneo,
          cupos_disponibles: Math.max(0, torneo.cupos_maximos - torneo.inscritos_actuales),
          categorias_disponibles: categorias
        };
      })
    );

    res.json(torneosEnriquecidos);
  } catch (err) {
    console.error('❌ Error obteniendo torneos disponibles:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;