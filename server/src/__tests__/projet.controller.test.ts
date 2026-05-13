import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../projet.modele/projet.User.ts', () => ({
    default: {
        findOne:  vi.fn(),
        findAll:  vi.fn(),
        create:   vi.fn(),
        destroy:  vi.fn(),
    },
}));

vi.mock('../projet.modele/projet.logs.ts', () => ({
    default: { findAll: vi.fn() },
}));

vi.mock('../config/mqtt.ts', () => ({
    default: { on: vi.fn(), publish: vi.fn() },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(opts: { body?: any; params?: any } = {}) {
    return { body: opts.body ?? {}, params: opts.params ?? {} } as any;
}

function mockRes() {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json   = vi.fn().mockReturnValue(res);
    return res;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('projetController', () => {
    let projetController: any;
    let User: any;
    let Log: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        ({ projetController } = await import('../projet.controller/projet.controller.ts'));
        User = (await import('../projet.modele/projet.User.ts')).default;
        Log  = (await import('../projet.modele/projet.logs.ts')).default;
    });

    // ── assignCard ─────────────────────────────────────────────────────────

    describe('assignCard', () => {
        it('retourne 400 si aucun badge récent', async () => {
            const res = mockRes();
            await projetController.assignCard(mockReq({ body: { username: 'alice' } }), res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('retourne 201 et crée un utilisateur si badge présent', async () => {
            // Simuler un badge scanné via le module interne
            const mqttClient = (await import('../config/mqtt.ts')).default as any;
            const [[, handler]] = mqttClient.on.mock.calls.filter(([t]: any) => t === 'message');

            // Simuler un badge inconnu
            User.findOne.mockResolvedValue(null);
            await handler('rfid/scan', Buffer.from(JSON.stringify({ uid: 'AABBCCDD' })));

            // Maintenant assigner
            const newUser = { id: 2, Username: 'alice', id_carte: 'AABBCCDD' };
            User.create.mockResolvedValue(newUser);
            const res = mockRes();
            await projetController.assignCard(mockReq({ body: { username: 'alice' } }), res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ Username: 'alice' }));
        });
    });

    // ── getAllUsers ─────────────────────────────────────────────────────────

    describe('getAllUsers', () => {
        it('retourne 200 avec la liste des utilisateurs non-admin', async () => {
            const users = [{ id: 1, Username: 'alice', isAdmin: false }];
            User.findAll.mockResolvedValue(users);
            const res = mockRes();
            await projetController.getAllUsers(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
            expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { isAdmin: false } }));
        });

        it('retourne 500 en cas d\'erreur', async () => {
            User.findAll.mockRejectedValue(new Error('DB error'));
            const res = mockRes();
            await projetController.getAllUsers(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ── getPresent ─────────────────────────────────────────────────────────

    describe('getPresent', () => {
        it('retourne 200 avec les utilisateurs présents', async () => {
            const presents = [{ id: 1, Username: 'alice', inside: true }];
            User.findAll.mockResolvedValue(presents);
            const res = mockRes();
            await projetController.getPresent(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { inside: true } }));
        });

        it('retourne 500 en cas d\'erreur', async () => {
            User.findAll.mockRejectedValue(new Error('DB error'));
            const res = mockRes();
            await projetController.getPresent(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ── deleteUser ─────────────────────────────────────────────────────────

    describe('deleteUser', () => {
        it('retourne 200 après suppression', async () => {
            User.destroy.mockResolvedValue(1);
            const res = mockRes();
            await projetController.deleteUser(mockReq({ params: { id: '1' } }), res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(User.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: { id: '1' } }));
        });

        it('retourne 500 en cas d\'erreur', async () => {
            User.destroy.mockRejectedValue(new Error('DB error'));
            const res = mockRes();
            await projetController.deleteUser(mockReq({ params: { id: '1' } }), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ── getLogs ────────────────────────────────────────────────────────────

    describe('getLogs', () => {
        it('retourne 200 avec la liste des logs', async () => {
            const logs = [{ id: 1, username: 'alice', action: 'entree' }];
            Log.findAll.mockResolvedValue(logs);
            const res = mockRes();
            await projetController.getLogs(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(logs);
        });

        it('retourne 500 en cas d\'erreur', async () => {
            Log.findAll.mockRejectedValue(new Error('DB error'));
            const res = mockRes();
            await projetController.getLogs(mockReq(), res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
