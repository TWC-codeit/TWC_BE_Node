const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'TWC API 문서',
    description: 'TWC의 Backend API입니다.',
    version: '1.0.0',
  },
  servers: [
    {
      "url": "http://13.238.115.119",
      "description": "twc-prod-02"
    },
    {
      "url": "http://3.26.157.251:3000",
      "description": "twc-prod-01"
    }
  ],
  schemes: ['http'],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
