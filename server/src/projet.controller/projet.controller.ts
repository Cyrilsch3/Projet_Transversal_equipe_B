import express from 'express';
import User from '../projet.modele/projet.User.ts'; // Imagine que ton modèle s'appelle User



let lastUnknownBadge: string | null = null;

export const projetController = {

    
    scanBadge: async (req: express.Request, res: express.Response) => {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({ message: "cardId manquant dans le body" });
        }

        console.log(`📡 Nouveau badge détecté par l'appareil : ${cardId}`);
        lastUnknownBadge = cardId; // On le stocke pour le frontend
        
        res.status(200).json({ message: "Badge reçu et mis en attente", cardId });
    },

   
    assignCard: async (req: express.Request, res: express.Response) => {
        const { username } = req.body;

        if (!lastUnknownBadge) {
            return res.status(400).json({ message: "Aucun badge n'a été scanné récemment." });
        }

        try {
            const newUser = await User.create({
                username: username,
                cardId: lastUnknownBadge 
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
            const users = await User.findAll();
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
        res.status(200).json({ message: "Route prête pour le futur check de présence" });
    }
};