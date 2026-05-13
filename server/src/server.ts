import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import sequelize from './config/db.ts';
import userRoutes from './projet.routes/routes.ts';
import User from './projet.modele/projet.User.ts';
import './config/broker.ts';
import './config/mqtt.js';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.use('/api', userRoutes);

sequelize.sync({ alter: true })
    .then(async () => {
        console.log("✅ Base de données sqlite3 synchronisée");

        // Seed admin par défaut
        const existing = await User.findOne({ where: { Username: 'admin' } });
        if (!existing) {
            const hash = await bcrypt.hash('admin', 10);
            await User.create({ Username: 'admin', password: hash, isAdmin: true, inside: false });
            console.log("👤 Utilisateur admin créé (admin/admin)");
        }

        app.listen(port, () => {
            console.log(`🚀 Serveur lancé sur : http://localhost:${port}/api`);
        });
    })
    .catch((error) => {
        console.error("❌ Erreur lors de la synchronisation :", error);
    });
