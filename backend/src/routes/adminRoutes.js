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

// Obtener todos los usuarios
router.get('/usuarios', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, nombre, email, rol
      FROM usuarios 
      ORDER BY nombre ASC
    `);
    
    console.log(`✅ ${rows.length} usuarios encontrados`);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error obteniendo usuarios:', err);
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

// Editar usuario
router.put('/usuarios/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    
    if (!nombre || !email || !rol) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar que el usuario existe
    const [usuario] = await db.execute(
      'SELECT id FROM usuarios WHERE id = ?',
      [id]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir que el último admin se cambie a atleta
    if (rol === 'atleta') {
      const [admins] = await db.execute(
        'SELECT COUNT(*) as count FROM usuarios WHERE rol = "admin" AND id != ?',
        [id]
      );
      
      if (admins[0].count === 0) {
        return res.status(400).json({ 
          message: 'No se puede cambiar el rol. Debe haber al menos un administrador en el sistema.' 
        });
      }
    }

    await db.execute(
      'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
      [nombre, email, rol, id]
    );
    
    res.json({ message: 'Usuario actualizado correctamente' });
    
  } catch (err) {
    console.error('❌ Error actualizando usuario:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    
    res.status(500).json({ message: 'Error actualizando usuario' });
  }
});

// Eliminar usuario
router.delete('/usuarios/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const [usuario] = await db.execute(
      'SELECT id, rol FROM usuarios WHERE id = ?',
      [id]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir eliminar el último admin
    if (usuario[0].rol === 'admin') {
      const [admins] = await db.execute(
        'SELECT COUNT(*) as count FROM usuarios WHERE rol = "admin"'
      );
      
      if (admins[0].count === 1) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el último administrador del sistema.' 
        });
      }
    }

    // Eliminar registros relacionados primero (inscripciones y resultados)
    await db.execute('DELETE FROM inscripciones WHERE atleta_id = ?', [id]);
    await db.execute('DELETE FROM resultados WHERE atleta_id = ?', [id]);
    
    // Luego eliminar el usuario
    await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    
    res.json({ message: 'Usuario eliminado correctamente' });
    
  } catch (err) {
    console.error('❌ Error eliminando usuario:', err);
    res.status(500).json({ message: 'Error eliminando usuario' });
  }
});

export default router;
