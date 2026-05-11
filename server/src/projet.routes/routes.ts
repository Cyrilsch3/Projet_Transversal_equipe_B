import { Router } from 'express';
import { projetController } from '../projet.controller/projet.controller.ts';
const router = Router();

router.post('/assign-card', projetController.assignCard);
router.get('/users', projetController.getAllUsers);
router.delete('/users/:id', projetController.deleteUser);
router.get('/present', projetController.getPresent);      
router.get('/rfid',projetController.scanBadge )
export default router;