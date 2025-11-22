import express from 'express';
import { db } from '../config/db.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();


// ADMIN: CRUD de Torneos

// Obtener todos los torneos
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, d.nombre AS deporte_nombre 
      FROM torneos t
      LEFT JOIN deportes d ON t.deporte_id = d.id
      ORDER BY t.fecha DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener torneos' });
  }
});

// Crear torneo
router.post('/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nombre, deporte_id, fecha, ubicacion, cupos } = req.body;
    await db.query(
      'INSERT INTO torneos (nombre, deporte_id, fecha, ubicacion, cupos_disponibles) VALUES (?, ?, ?, ?, ?)',
      [nombre, deporte_id, fecha, ubicacion, cupos]
    );
    res.json({ message: 'Torneo creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear torneo' });
  }
});

//  Actualizar un torneo
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha, ubicacion, deporte_id, cupos } = req.body;

    await db.query(
      `UPDATE torneos 
       SET nombre = ?, fecha = ?, ubicacion = ?, deporte_id = ?, cupos = ? 
       WHERE id = ?`,
      [nombre, fecha, ubicacion, deporte_id, cupos, id]
    );

    res.json({ message: 'Torneo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar torneo:', error);
    res.status(500).json({ message: 'Error al actualizar torneo' });
  }
});


// Eliminar torneo
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM torneos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Torneo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar torneo' });
  }
});


// ATLETA: Torneos e inscripciones


// Torneos disponibles
router.get('/atleta/torneos-disponibles', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
     SELECT 
        t.id,
        t.nombre,
        t.fecha,
        t.ubicacion,
        d.nombre AS deporte_nombre,
        t.estado,
        (SELECT COUNT(*) FROM inscripciones i WHERE i.torneo_id = t.id) AS inscritos,
        50 AS cupos_totales, -- Valor temporal fijo
        (50 - (SELECT COUNT(*) FROM inscripciones i WHERE i.torneo_id = t.id)) AS cupos_disponibles
      FROM torneos t
      LEFT JOIN deportes d ON t.deporte_id = d.id
      WHERE t.estado = 'abierto'
      HAVING cupos_disponibles > 0
      ORDER BY t.fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo torneos disponibles:', error);
    res.status(500).json({ message: 'Error obteniendo torneos disponibles' });
  }
});

export default router;
