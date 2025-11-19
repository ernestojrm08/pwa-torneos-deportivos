import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import { db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import atletaRoutes from './routes/atletaRoutes.js';
import deportesRoutes from './routes/deportesRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';
import { verify } from 'crypto';
import { verifyToken } from './middlewares/auth.js';

dotenv.config();

const app = express();

// Cargar documentación YAML
const file = fs.readFileSync('../docs/openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use(cors());
app.use(express.json());

// Ruta para la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Tus rutas existentes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/atleta', atletaRoutes);
app.use('/api/deportes', deportesRoutes);
app.use('/api/categorias', categoriasRoutes);


app.get('/', (req, res) => {
  res.send('API PWA Torneos Deportivos corriendo correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});