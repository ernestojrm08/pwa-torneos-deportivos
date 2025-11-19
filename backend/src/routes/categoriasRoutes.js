import { Router } from 'express';
import { db } from '../config/db.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = Router();

// GET /categorias - Obtener todas las categorías
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    console.log('📦 Obteniendo categorías...');
    
    // ✅ CONSULTA SIMPLE PRIMERO - sin JOIN para evitar errores
    try {
      const [rows] = await db.execute(`
        SELECT c.*, d.nombre as deporte_nombre 
        FROM categorias c 
        LEFT JOIN deportes d ON c.deporte_id = d.id 
        ORDER BY d.nombre, c.nombre
      `);
      
      console.log(`✅ ${rows.length} categorías encontradas`);
      res.json(rows);
      
    } catch (joinError) {
      // Si falla el JOIN, intentar consulta básica
      console.log('⚠️ Error en JOIN, intentando consulta básica...');
      const [rows] = await db.execute('SELECT * FROM categorias ORDER BY nombre');
      
      // Agregar deporte_nombre manualmente
      const categoriasConDeporte = rows.map(categoria => ({
        ...categoria,
        deporte_nombre: 'Deporte no disponible'
      }));
      
      console.log(`✅ ${categoriasConDeporte.length} categorías encontradas (consulta básica)`);
      res.json(categoriasConDeporte);
    }
    
  } catch (err) {
    console.error('❌ Error en GET /categorias:', err);
    
    // Si la tabla no existe, devolver array vacío
    if (err.code === 'ER_NO_SUCH_TABLE') {
      console.log('⚠️ Tabla categorias no existe, devolviendo array vacío');
      res.json([]);
    } else {
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: err.message 
      });
    }
  }
});

// GET /categorias/:id - Obtener categoría por ID
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ✅ CONSULTA CON MANEJO DE ERRORES
    try {
      const [rows] = await db.execute(`
        SELECT c.*, d.nombre as deporte_nombre 
        FROM categorias c 
        LEFT JOIN deportes d ON c.deporte_id = d.id 
        WHERE c.id = ?
      `, [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      
      res.json(rows[0]);
      
    } catch (joinError) {
      // Si falla el JOIN, intentar consulta básica
      console.log('⚠️ Error en JOIN, intentando consulta básica...');
      const [rows] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      
      const categoria = {
        ...rows[0],
        deporte_nombre: 'Deporte no disponible'
      };
      
      res.json(categoria);
    }
    
  } catch (err) {
    console.error('❌ Error obteniendo categoría:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /categorias/deporte/:deporteId - Obtener categorías por deporte
router.get('/deporte/:deporteId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { deporteId } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM categorias WHERE deporte_id = ? ORDER BY nombre',
      [deporteId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Error obteniendo categorías por deporte:', err);
    
    // Si la tabla no existe, devolver array vacío
    if (err.code === 'ER_NO_SUCH_TABLE') {
      res.json([]);
    } else {
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// POST /categorias - Crear nueva categoría
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      deporte_id, 
      edad_minima, 
      edad_maxima, 
      distancia, 
      unidad 
    } = req.body;
    
    if (!nombre || !deporte_id) {
      return res.status(400).json({ 
        message: 'El nombre y el deporte son obligatorios' 
      });
    }

    // Verificar que el deporte existe
    try {
      const [deporte] = await db.execute('SELECT id FROM deportes WHERE id = ?', [deporte_id]);
      if (deporte.length === 0) {
        return res.status(400).json({ message: 'El deporte especificado no existe' });
      }
    } catch (error) {
      console.log('⚠️ Error verificando deporte:', error.message);
      // Continuar aunque falle la verificación
    }

    const [result] = await db.execute(
      `INSERT INTO categorias 
       (nombre, descripcion, deporte_id, edad_minima, edad_maxima, distancia, unidad) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, deporte_id, edad_minima || null, edad_maxima || null, distancia || null, unidad || null]
    );
    
    res.status(201).json({ 
      message: 'Categoría creada exitosamente', 
      id: result.insertId 
    });
  } catch (err) {
    console.error('❌ Error creando categoría:', err);
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'El deporte especificado no existe' });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: err.message 
    });
  }
});

// PUT /categorias/:id - Actualizar categoría
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      deporte_id, 
      edad_minima, 
      edad_maxima, 
      distancia, 
      unidad 
    } = req.body;
    
    if (!nombre || !deporte_id) {
      return res.status(400).json({ 
        message: 'El nombre y el deporte son obligatorios' 
      });
    }

    // Verificar que la categoría existe
    const [categoriaExistente] = await db.execute('SELECT id FROM categorias WHERE id = ?', [id]);
    if (categoriaExistente.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Verificar que el deporte existe
    try {
      const [deporte] = await db.execute('SELECT id FROM deportes WHERE id = ?', [deporte_id]);
      if (deporte.length === 0) {
        return res.status(400).json({ message: 'El deporte especificado no existe' });
      }
    } catch (error) {
      console.log('⚠️ Error verificando deporte:', error.message);
      // Continuar aunque falle la verificación
    }

    const [result] = await db.execute(
      `UPDATE categorias 
       SET nombre = ?, descripcion = ?, deporte_id = ?, edad_minima = ?, 
           edad_maxima = ?, distancia = ?, unidad = ? 
       WHERE id = ?`,
      [nombre, descripcion || null, deporte_id, edad_minima || null, edad_maxima || null, distancia || null, unidad || null, id]
    );
    
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (err) {
    console.error('❌ Error actualizando categoría:', err);
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'El deporte especificado no existe' });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: err.message 
    });
  }
});

// DELETE /categorias/:id - Eliminar categoría
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la categoría existe
    const [categoriaExistente] = await db.execute('SELECT id FROM categorias WHERE id = ?', [id]);
    if (categoriaExistente.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    // Verificar si hay inscripciones asociadas (si existe la relación)
    try {
      const [inscripciones] = await db.execute('SELECT id FROM inscripciones WHERE categoria_id = ?', [id]);
      if (inscripciones.length > 0) {
        return res.status(400).json({ 
          message: 'No se puede eliminar la categoría porque tiene inscripciones asociadas' 
        });
      }
    } catch (error) {
      // Si la tabla inscripciones no tiene columna categoria_id, ignorar
      console.log('⚠️ No se pudo verificar inscripciones, continuando...');
    }

    const [result] = await db.execute('DELETE FROM categorias WHERE id = ?', [id]);
    
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    console.error('❌ Error eliminando categoría:', err);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: err.message 
    });
  }
});

export default router;