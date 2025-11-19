import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = Router();

// GET /deportes - Obtener todos los deportes
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    console.log('📦 Obteniendo deportes...');
    
    // ✅ CONSULTA SIMPLE - sin JOIN problemático
    const [rows] = await db.execute('SELECT * FROM deportes ORDER BY nombre');
    
    console.log(`✅ ${rows.length} deportes encontrados`);
    
    // Para cada deporte, contar categorías manualmente (con manejo de errores)
    const deportesConConteo = await Promise.all(
      rows.map(async (deporte) => {
        try {
          // Contar categorías para este deporte
          const [categorias] = await db.execute(
            'SELECT COUNT(*) as total FROM categorias WHERE deporte_id = ?',
            [deporte.id]
          );
          return {
            ...deporte,
            total_categorias: categorias[0].total || 0
          };
        } catch (error) {
          // Si hay error (tabla no existe), devolver 0
          console.log(`⚠️ Error contando categorías para deporte ${deporte.id}:`, error.message);
          return {
            ...deporte,
            total_categorias: 0
          };
        }
      })
    );
    
    res.json(deportesConConteo);
    
  } catch (err) {
    console.error('❌ Error en GET /deportes:', err);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: err.message 
    });
  }
});

// GET /deportes/:id - Obtener deporte por ID
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM deportes WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Deporte no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error obteniendo deporte:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /deportes - Crear nuevo deporte
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const [result] = await db.execute(
      'INSERT INTO deportes (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    
    res.status(201).json({ 
      message: 'Deporte creado exitosamente', 
      id: result.insertId 
    });
  } catch (err) {
    console.error('❌ Error creando deporte:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un deporte con ese nombre' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /deportes/:id - Actualizar deporte
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const [result] = await db.execute(
      'UPDATE deportes SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deporte no encontrado' });
    }
    
    res.json({ message: 'Deporte actualizado exitosamente' });
  } catch (err) {
    console.error('❌ Error actualizando deporte:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Ya existe un deporte con ese nombre' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /deportes/:id - Eliminar deporte
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay categorías asociadas (con manejo de errores)
    try {
      const [categorias] = await db.execute('SELECT id FROM categorias WHERE deporte_id = ?', [id]);
      if (categorias.length > 0) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el deporte porque tiene categorías asociadas' 
        });
      }
    } catch (error) {
      console.log('⚠️ No se pudo verificar categorías, continuando...');
    }

    // Verificar si hay torneos asociados
    const [torneos] = await db.execute('SELECT id FROM torneos WHERE deporte_id = ?', [id]);
    if (torneos.length > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el deporte porque tiene torneos asociados' 
      });
    }

    const [result] = await db.execute('DELETE FROM deportes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Deporte no encontrado' });
    }
    
    res.json({ message: 'Deporte eliminado exitosamente' });
  } catch (err) {
    console.error('❌ Error eliminando deporte:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;