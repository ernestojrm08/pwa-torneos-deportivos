import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = Router();

// Crear nuevo torneo
router.post('/torneos', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nombre, fecha, ubicacion, deporte_id, estado = 'abierto' } = req.body;
    
    if (!nombre || !fecha || !ubicacion || !deporte_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const [result] = await db.execute(
      'INSERT INTO torneos (nombre, fecha, ubicacion, deporte_id, estado) VALUES (?, ?, ?, ?, ?)',
      [nombre, fecha, ubicacion, deporte_id, estado]
    );
    
    res.status(201).json({ 
      message: 'Torneo creado exitosamente', 
      id: result.insertId 
    });
  } catch (err) {
    console.error('❌ Error creando torneo:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener deportes para el formulario
router.get('/deportes', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nombre FROM deportes ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error obteniendo deportes:', err);
    res.status(500).json({ message: 'Error interno' });
  }
});


// Ruta protegida admin: conteos para dashboard
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    // Conteos: usuarios, torneos activos, inscripciones totales
    const [[{ usuarios }]] = await db.query('SELECT COUNT(*) AS usuarios FROM usuarios');
    const [[{ torneos_activos }]] = await db.query("SELECT COUNT(*) AS torneos_activos FROM torneos WHERE estado = 'abierto'");
    const [[{ inscripciones }]] = await db.query('SELECT COUNT(*) AS inscripciones FROM inscripciones');

    res.json({ usuarios, torneos_activos, inscripciones });
  } catch (err) {
    console.error('❌ Error admin/dashboard:', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Lista de torneos (página y limit opcionales)
router.get('/torneos', verifyToken, isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(
      `SELECT t.id, t.nombre, t.fecha, t.ubicacion, t.estado, d.nombre AS deporte
       FROM torneos t LEFT JOIN deportes d ON t.deporte_id = d.id
       ORDER BY t.fecha DESC LIMIT ? OFFSET ?`, [limit, offset]
    );

    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM torneos');
    res.json({ data: rows, page, limit, total });
  } catch (err) {
    console.error('❌ Error admin/torneos:', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

export default router;
