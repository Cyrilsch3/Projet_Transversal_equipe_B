import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const JWT_SECRET = 'projet_transversal_secret_b';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Non authentifié' });
        return;
    }
    const token = auth.slice(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ message: 'Token invalide ou expiré' });
    }
}
//commit