import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/networks/:id/alerts', (_req, res) => res.json({ success: true, data: { items: [], summary: { total: 0, new: 0, acknowledged: 0, resolved: 0 } } }));
router.patch('/alerts/:id/acknowledge', (req, res) => res.json({ success: true, data: { id: req.params.id, status: 'acknowledged', acknowledgedAt: new Date().toISOString() } }));

export default router;
