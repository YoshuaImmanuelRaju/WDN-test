import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/networks/:id/clusters', (_req, res) => res.json({ success: true, data: { items: [] } }));
router.post('/networks/:id/clusters', (req, res) => res.status(201).json({ success: true, data: { id: 'cluster-demo', name: req.body.name, status: 'active' } }));

export default router;
