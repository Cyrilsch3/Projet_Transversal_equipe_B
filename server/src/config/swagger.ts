import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Projet Transversal — Équipe B',
            version: '1.0.0',
            description: 'API de gestion de présence par badges RFID',
        },
        servers: [{ url: '/api' }],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id:       { type: 'integer', example: 1 },
                        Username: { type: 'string',  example: 'alice' },
                        id_carte: { type: 'string',  example: 'B31EBB19' },
                        inside:   { type: 'boolean', example: false },
                        isAdmin:  { type: 'boolean', example: false },
                    },
                },
                Log: {
                    type: 'object',
                    properties: {
                        id:        { type: 'integer', example: 1 },
                        username:  { type: 'string',  example: 'alice' },
                        id_carte:  { type: 'string',  example: 'B31EBB19' },
                        action:    { type: 'string',  enum: ['entree', 'sortie'], example: 'entree' },
                        timestamp: { type: 'string',  format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Erreur serveur' },
                    },
                },
            },
        },
    },
    apis: ['./src/projet.routes/routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'API Équipe B',
    }));
    console.log('📚 Swagger disponible sur http://localhost:3000/api/docs');
}
