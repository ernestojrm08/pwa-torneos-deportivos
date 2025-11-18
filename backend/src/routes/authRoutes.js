import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import dotenv from 'dotenv';
import { verifyToken } from '../middlewares/auth.js';
dotenv.config();

const router = Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol = 'atleta' } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    // Verificar si existe
    const [existing] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Usuario ya registrado' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, rol, nombre }, process.env.JWT_SECRET, { expiresIn: '4h' });

    res.status(201).json({
      message: 'Registro exitoso',
      token,
      usuario: { id: userId, nombre, email, rol }
    });
  } catch (error) {
    console.error('❌ Error en /register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol, nombre: usuario.nombre }, process.env.JWT_SECRET, { expiresIn: '4h' });

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


// Endpoint para verificar token
router.get('/verify', verifyToken, (req, res) => {
  res.json({
    message: 'Token válido',
    usuario: req.user
  });
});


export default router;
