import { Request, Response } from 'express';
import User from '../projet.modele/projet.User'; // Imagine que ton modèle s'appelle User

// Simulation d'un stockage temporaire (en mémoire)
let lastUnknownBadge: string | null = null;

export const projetController = {

    // Route : POST /api/assign-card
    // But : Créer un utilisateur en prenant le dernier badge scanné
    assignCard: async (req: Request, res: Response) => {
        const { username } = req.body;

        if (!lastUnknownBadge) {
            return res.status(400).json({ message: "Aucun badge n'a été scanné récemment." });
        }

        try {
            const newUser = await User.create({
                username: username,
                cardId: lastUnknownBadge // On utilise le badge stocké
            });

            lastUnknownBadge = null; // On vide la variable après utilisation
            res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
        }
    },

    // Route : GET /api/users
    // But : Récupérer tous les utilisateurs
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération." });
        }
    },

    // Route : DELETE /api/users/:id
    // But : Supprimer un utilisateur par son ID
    deleteUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            res.status(200).json({ message: "Utilisateur supprimé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression." });
        }
    },

    // Route : GET /api/present
    // But : À brancher plus tard (placeholder pour l'instant)
    getPresent: async (req: Request, res: Response) => {
        res.status(200).json({ message: "Route prête pour le futur check de présence" });
    }
};