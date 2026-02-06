import { Router } from 'express';
import { db } from '../../store/memory';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/', (req: AuthenticatedRequest, res) => {
  const items = db.networks.filter((n) => n.ownerId === req.user!.id || req.user!.role === 'admin');
  res.json({ success: true, data: { items, pagination: { page: 1, limit: 20, total: items.length, totalPages: 1 } } });
});

router.post('/upload', (req: AuthenticatedRequest, res) => {
  const { name, description } = req.body as { name: string; description?: string };
  const network = db.createNetwork({
    ownerId: req.user!.id,
    name,
    description,
    nodeCount: 0,
    pipeCount: 0,
    status: 'processing',
  });
  res.status(201).json({ success: true, data: { id: network.id, name: network.name, status: network.status, uploadUrl: `/networks/${network.id}/status` } });
});

router.get('/:id', (req, res) => {
  const network = db.networks.find((n) => n.id === req.params.id);
  if (!network) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Network not found' } });
  return res.json({ success: true, data: { ...network, nodes: [], pipes: [], clusters: [] } });
});

router.delete('/:id', (req, res) => {
  const idx = db.networks.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Network not found' } });
  db.networks.splice(idx, 1);
  return res.status(204).send();
});

export default router;
