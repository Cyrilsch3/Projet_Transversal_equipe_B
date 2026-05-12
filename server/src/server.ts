import express from 'express';
import cors from 'cors';
import sequelize from './config/db.ts';
import userRoutes from './projet.routes/routes.ts';
import './config/broker.ts';
import './config/mqtt.js';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.use('/api', userRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log("✅ Base de données sqlite3 synchronisée");


        app.listen(port, () => {

            console.log(`🚀 Serveur lancé sur : http://localhost:${port}/api`);
        });
    })
    .catch((error) => {
        console.error("❌ Erreur lors de la synchronisation :", error);
    });