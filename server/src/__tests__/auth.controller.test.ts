import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authController } from '../projet.controller/auth.controller.ts';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockUser = {
    id: 1,
    Username: 'admin',
    password: '$2b$10$hashedpassword',
    isAdmin: true,
};

vi.mock('../projet.modele/projet.User.ts', () => ({
    default: { findOne: vi.fn() },
}));

vi.mock('bcrypt', () => ({
    default: { compare: vi.fn() },
}));

vi.mock('jsonwebtoken', () => ({
    default: { sign: vi.fn(() => 'mock.jwt.token') },
}));

vi.mock('../config/auth.ts', () => ({
    JWT_SECRET: 'test_secret',
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(body = {}) {
    return { body } as any;
}

function mockRes() {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json   = vi.fn().mockReturnValue(res);
    return res;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('authController.login', () => {
    let User: any;
    let bcrypt: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        User   = (await import('../projet.modele/projet.User.ts')).default;
        bcrypt = (await import('bcrypt')).default;
    });

    it('retourne 400 si username manquant', async () => {
        const res = mockRes();
        await authController.login(mockReq({ password: 'admin' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });

    it('retourne 400 si password manquant', async () => {
        const res = mockRes();
        await authController.login(mockReq({ username: 'admin' }), res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 401 si utilisateur introuvable', async () => {
        User.findOne.mockResolvedValue(null);
        const res = mockRes();
        await authController.login(mockReq({ username: 'inconnu', password: 'xxx' }), res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('retourne 401 si mot de passe incorrect', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);
        const res = mockRes();
        await authController.login(mockReq({ username: 'admin', password: 'mauvais' }), res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('retourne 200 et un token si identifiants valides', async () => {
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        const res = mockRes();
        await authController.login(mockReq({ username: 'admin', password: 'admin' }), res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'mock.jwt.token' }));
    });

    it('retourne 500 si erreur base de données', async () => {
        User.findOne.mockRejectedValue(new Error('DB error'));
        const res = mockRes();
        await authController.login(mockReq({ username: 'admin', password: 'admin' }), res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
