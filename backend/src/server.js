// servidor principal
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import atletaRoutes from './routes/atletaRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Rutas del servidor
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/atleta', atletaRoutes);

app.get('/', (req, res) => {
  res.send(' API PWA Torneos Deportivos corriendo correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Servidor backend en puerto ${PORT}`));
