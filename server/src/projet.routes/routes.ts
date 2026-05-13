import { Router } from 'express';
import { projetController } from '../projet.controller/projet.controller.ts';
import { authController } from '../projet.controller/auth.controller.ts';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion administrateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Champs manquants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/login', authController.login);

router.use(authMiddleware);

/**
 * @openapi
 * /assign-card:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Assigner le dernier badge scanné à un utilisateur
 *     description: Crée un nouvel utilisateur RFID avec le dernier badge inconnu capté par le broker MQTT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *                 example: alice
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Aucun badge scanné récemment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/assign-card', projetController.assignCard);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Lister tous les utilisateurs RFID
 *     description: Retourne tous les utilisateurs non-admin (porteurs de badge).
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/users', projetController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprimer un utilisateur RFID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur supprimé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/users/:id', projetController.deleteUser);

/**
 * @openapi
 * /present:
 *   get:
 *     tags: [Présence]
 *     summary: Lister les utilisateurs actuellement dans la pièce
 *     responses:
 *       200:
 *         description: Liste des utilisateurs présents (inside = true)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/present', projetController.getPresent);

/**
 * @openapi
 * /logs:
 *   get:
 *     tags: [Historique]
 *     summary: Lister l'historique des entrées et sorties
 *     description: Retourne tous les logs triés du plus récent au plus ancien.
 *     responses:
 *       200:
 *         description: Liste des logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/logs', projetController.getLogs);

export default router;
//commit