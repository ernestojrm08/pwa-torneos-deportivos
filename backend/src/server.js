// servidor principal
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('🌐 API PWA Torneos Deportivos corriendo correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Servidor backend en puerto ${PORT}`));
