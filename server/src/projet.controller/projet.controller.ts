import express from 'express';
import User from '../projet.modele/projet.User.ts';
import Log from '../projet.modele/projet.logs.ts';
import mqttClient from '../config/mqtt.ts';

let lastUnknownBadge: string | null;

mqttClient.on('message', async (topic, message) => {
    if (topic !== 'rfid/scan') return;

    let cardId: string;
    try {
        const data = JSON.parse(message.toString());
        cardId = String(data.uid).toUpperCase().trim();
    } catch {
        return;
    }
    console.log(`📡 [MQTT] Badge capté : ${cardId}`);

    const user = await User.findOne({ where: { id_carte: cardId } });
    const responseTopic = `rfid/response/${cardId}`;

    if (user) {
        user.inside = !user.inside;
        await user.save();

        await Log.create({
            username: user.Username,
            id_carte: cardId,
            action: user.inside ? 'entree' : 'sortie',
        });

        console.log(`🔄 ${user.Username} → inside: ${user.inside}`);
        const response = { status: 'ok', ok: user.inside, name: user.Username, uid: cardId };
        mqttClient.publish(responseTopic, JSON.stringify(response), { qos: 1 });
    } else {
        lastUnknownBadge = cardId;
        console.log(`❓ Badge inconnu, en attente d'assignation : ${cardId}`);
        const response = { status: 'pending', uid: cardId };
        mqttClient.publish(responseTopic, JSON.stringify(response), { qos: 1 });
    }
});

export const projetController = {
   
    assignCard: async (req: express.Request, res: express.Response) => {
        const { username } = req.body;

        if (!lastUnknownBadge) {
            return res.status(400).json({ message: "Aucun badge n'a été scanné récemment." });
        }

        try {
            const newUser = await User.create({
                Username: username,
                id_carte: lastUnknownBadge,
                inside: false
            });

            console.log(`✅ Utilisateur ${username} créé avec le badge ${lastUnknownBadge}`);
            lastUnknownBadge = null; // On vide pour le prochain
            
            res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
        }
    },

    
    getAllUsers: async (req: express.Request, res: express.Response) => {
        try {
            const users = await User.findAll({ where: { isAdmin: false } });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération." });
        }
    },

    
    deleteUser: async (req: express.Request, res: express.Response) => {
        const { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            res.status(200).json({ message: "Utilisateur supprimé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression." });
        }
    },

   
    getPresent: async (req: express.Request, res: express.Response) => {
        try {
            const users = await User.findAll({ where: { inside: true } });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des présents." });
        }

    },
    getLogs: async (req: express.Request, res: express.Response) => {
        try {
            const logs = await Log.findAll({
                order: [['timestamp', 'DESC']],
            });
            res.status(200).json(logs);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des logs." });
        }
    },
};
//mo
