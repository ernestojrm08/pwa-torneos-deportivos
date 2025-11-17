import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, rol, nombre }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (req.user.rol !== 'admin') return res.status(403).json({ message: 'Acceso restringido: admin' });
  next();
};
