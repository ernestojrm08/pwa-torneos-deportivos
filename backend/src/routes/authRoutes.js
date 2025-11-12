// Ruta de autenticación
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Buscar usuario
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    // Comparar contraseña
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Respuesta final
    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('❌ Error en /login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
