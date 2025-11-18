import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Torneos Deportivos',
      version: '1.0.0',
      description: 'API REST para gestión de torneos deportivos',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@torneos.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };