import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = Router();

// GET /atletas - Obtener todos los atletas (solo admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    console.log('📦 Obteniendo lista de atletas...');
    
    const [rows] = await db.execute(`
      SELECT u.id, u.nombre, u.email, u.rol, 
             COUNT(DISTINCT i.id) as total_inscripciones,
             COUNT(DISTINCT r.id) as total_resultados
      FROM usuarios u 
      LEFT JOIN inscripciones i ON u.id = i.atleta_id 
      LEFT JOIN resultados r ON u.id = r.atleta_id 
      WHERE u.rol = 'atleta'
      GROUP BY u.id
      ORDER BY u.nombre
    `);
    
    console.log(`✅ ${rows.length} atletas encontrados`);
    res.json(rows);
    
  } catch (err) {
    console.error('❌ Error obteniendo atletas:', err);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: err.message 
    });
  }
});

// GET /atletas/:id - Obtener perfil completo de atleta
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario es atleta
    const [usuario] = await db.execute(
      'SELECT id, nombre, email, rol FROM usuarios WHERE id = ? AND rol = ?',
      [id, 'atleta']
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Atleta no encontrado' });
    }

    // Obtener inscripciones del atleta
    const [inscripciones] = await db.execute(`
      SELECT i.*, t.nombre as torneo_nombre, t.fecha, t.ubicacion,
             d.nombre as deporte_nombre, c.nombre as categoria_nombre
      FROM inscripciones i
      JOIN torneos t ON i.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON i.categoria_id = c.id
      WHERE i.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [id]);

    // Obtener resultados del atleta
    const [resultados] = await db.execute(`
      SELECT r.*, t.nombre as torneo_nombre, t.fecha,
             d.nombre as deporte_nombre, c.nombre as categoria_nombre
      FROM resultados r
      JOIN torneos t ON r.torneo_id = t.id
      LEFT JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON r.categoria_id = c.id
      WHERE r.atleta_id = ?
      ORDER BY t.fecha DESC
    `, [id]);

    const atleta = {
      ...usuario[0],
      inscripciones,
      resultados,
      estadisticas: {
        total_inscripciones: inscripciones.length,
        total_resultados: resultados.length,
        victorias: resultados.filter(r => r.posicion === 1).length
      }
    };

    res.json(atleta);
    
  } catch (err) {
    console.error('❌ Error obteniendo atleta:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /atletas/:id - Actualizar datos de atleta (solo admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    
    if (!nombre || !email) {
      return res.status(400).json({ message: 'Nombre y email son obligatorios' });
    }

    // Verificar que el atleta existe
    const [atleta] = await db.execute(
      'SELECT id FROM usuarios WHERE id = ? AND rol = ?',
      [id, 'atleta']
    );
    
    if (atleta.length === 0) {
      return res.status(404).json({ message: 'Atleta no encontrado' });
    }

    const [result] = await db.execute(
      'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, id]
    );
    
    res.json({ message: 'Atleta actualizado exitosamente' });
    
  } catch (err) {
    console.error('❌ Error actualizando atleta:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;