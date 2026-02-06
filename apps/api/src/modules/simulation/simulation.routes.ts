import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { authenticateToken } from '../../middleware/auth.middleware';
import { db } from '../../store/memory';

const router = Router();
router.use(authenticateToken);

router.post('/networks/:id/simulations', (req, res) => {
  const jobId = uuid();
  db.simulations.push({ jobId, networkId: req.params.id, status: 'queued', progress: 0, createdAt: new Date().toISOString() });
  setTimeout(() => {
    const sim = db.simulations.find((s) => s.jobId === jobId);
    if (sim) {
      sim.status = 'completed';
      sim.progress = 100;
    }
  }, 2500);

  res.status(202).json({ success: true, data: { jobId, status: 'queued', position: 1, estimatedTime: '1m', webhookUrl: `/ws/simulations/${jobId}` } });
});

router.get('/simulations/:jobId', (req, res) => {
  const sim = db.simulations.find((s) => s.jobId === req.params.jobId);
  if (!sim) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Simulation not found' } });
  return res.json({ success: true, data: sim.status === 'completed' ? { ...sim, result: { totalCost: 1000, efficiencyScore: 85, nodePressures: {}, pipeFlows: {}, leakData: {} } } : sim });
});

export default router;
