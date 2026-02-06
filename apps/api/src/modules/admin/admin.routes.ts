import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken, requireRole('admin', 'super_admin'));

router.get('/admin/algorithms', (_req, res) => res.json({ success: true, data: { items: [] } }));

export default router;
