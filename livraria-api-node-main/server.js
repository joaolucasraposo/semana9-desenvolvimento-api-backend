const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const openapiSpecification = require('./docs/openapi');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Especificação OpenAPI 3.0 bruta em formato JSON
app.get(['/docs/api.json', '/api-docs.json', '/api/docs.json'], (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openapiSpecification);
});

// Interface Interativa da Documentação (Swagger UI)
const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'Livraria API - Documentação OpenAPI 3.0',
  swaggerOptions: {
    persistAuthorization: true
  }
};

app.use('/docs/api', swaggerUi.serveFiles(openapiSpecification, swaggerUiOptions), swaggerUi.setup(openapiSpecification, swaggerUiOptions));
app.use('/api/docs', swaggerUi.serveFiles(openapiSpecification, swaggerUiOptions), swaggerUi.setup(openapiSpecification, swaggerUiOptions));
app.use('/docs', swaggerUi.serveFiles(openapiSpecification, swaggerUiOptions), swaggerUi.setup(openapiSpecification, swaggerUiOptions));

// Agrupamento Semântico de Rotas (RESTful /api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/autores', autorRoutes);

// Middleware Global de Tratamento de Erros
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Livraria API rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger UI disponível em http://localhost:${PORT}/docs`);
    console.log(`Especificação OpenAPI JSON disponível em http://localhost:${PORT}/docs/api.json e http://localhost:${PORT}/api-docs.json`);
  });
}

module.exports = app;