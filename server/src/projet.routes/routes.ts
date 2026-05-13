import { Router } from 'express';
import { projetController } from '../projet.controller/projet.controller.ts';
import { authController } from '../projet.controller/auth.controller.ts';
import { authMiddleware } from '../config/auth.ts';

const router = Router();

// Route publique
router.post('/auth/login', authController.login);

// Routes protégées
router.use(authMiddleware);
router.post('/assign-card', projetController.assignCard);
router.get('/users',        projetController.getAllUsers);
router.delete('/users/:id', projetController.deleteUser);

router.get('/present', projetController.getPresent);
router.get('/logs', projetController.getLogs);
export default router;

