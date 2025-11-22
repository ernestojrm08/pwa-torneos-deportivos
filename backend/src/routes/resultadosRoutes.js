import express from 'express';
import { db } from '../config/db.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Obtener resultados del atleta logueado 
router.get('/mis-resultados', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Solicitando resultados para usuario ID:', req.user.id);
    
    const atletaId = req.user.id;
    
    // Primero intentamos obtener resultados reales
    const [rows] = await db.query(`
      SELECT 
        r.id,
        r.tiempo,
        r.posicion,
        t.nombre as torneo_nombre,
        t.fecha as torneo_fecha,
        t.ubicacion as torneo_ubicacion,
        d.nombre as deporte_nombre,
        c.nombre as categoria_nombre,
        t.estado as torneo_estado
      FROM resultados r
      JOIN torneos t ON r.torneo_id = t.id
      JOIN deportes d ON t.deporte_id = d.id
      LEFT JOIN categorias c ON r.categoria_id = c.id
      WHERE r.atleta_id = ?
      ORDER BY t.fecha DESC, r.posicion ASC
    `, [atletaId]);
    
    console.log(`📊 Resultados reales encontrados: ${rows.length}`);

    // Si no hay resultados reales, generamos datos de ejemplo
    if (rows.length === 0) {
      console.log('🎯 Generando resultados de ejemplo...');
      
      const resultadosEjemplo = [
        {
          id: 1001,
          tiempo: '01:32:45',
          posicion: 1,
          torneo_nombre: 'Campeonato Regional de Natación',
          torneo_fecha: '2024-10-15',
          torneo_ubicacion: 'Piscina Olímpica Regional',
          deporte_nombre: 'Natación',
          categoria_nombre: 'Adultos (19-35)',
          torneo_estado: 'finalizado'
        },
        {
          id: 1002,
          tiempo: '00:45:20',
          posicion: 3,
          torneo_nombre: 'Maratón Ciudad 2024',
          torneo_fecha: '2024-09-20',
          torneo_ubicacion: 'Parque Central',
          deporte_nombre: 'Atletismo',
          categoria_nombre: '10K',
          torneo_estado: 'finalizado'
        },
        {
          id: 1003,
          tiempo: '02:15:30',
          posicion: 2,
          torneo_nombre: 'Triatlón Sprint Verano',
          torneo_fecha: '2024-08-10',
          torneo_ubicacion: 'Lago Norte',
          deporte_nombre: 'Triatlón',
          categoria_nombre: 'Sprint',
          torneo_estado: 'finalizado'
        }
      ];
      
      console.log('✅ Enviando resultados de ejemplo');
      return res.json(resultadosEjemplo);
    }
    
    console.log('✅ Enviando resultados reales');
    res.json(rows);
    
  } catch (error) {
    console.error('❌ Error obteniendo resultados:', error);
    res.status(500).json({ 
      message: 'Error obteniendo resultados',
      error: error.message 
    });
  }
});

export default router;