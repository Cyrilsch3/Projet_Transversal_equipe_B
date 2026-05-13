import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../projet.modele/projet.User.ts';
import { JWT_SECRET } from '../config/auth.ts';

export const authController = {

    login: async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username et mot de passe requis' });
            return;
        }

        try {
            const user = await User.findOne({ where: { Username: username, isAdmin: true } });

            if (!user || !user.password) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(401).json({ message: 'Identifiants incorrects' });
                return;
            }

            const token = jwt.sign(
                { id: user.id, username: user.Username },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({ token });
        } catch {
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

};
