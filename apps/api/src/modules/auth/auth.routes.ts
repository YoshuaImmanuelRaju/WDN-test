import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { db } from '../../store/memory';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = db.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const payload = { id: user.id, email: user.email, role: user.role, permissions: user.permissions };
  const accessToken = jwt.sign(payload, env.jwtSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: '7d' });

  return res.json({
    success: true,
    data: { accessToken, refreshToken, expiresIn: 3600, user: payload },
  });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'refreshToken is required' } });
  try {
    const decoded = jwt.verify(refreshToken, env.jwtSecret) as { id: string };
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) throw new Error('not-found');
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, permissions: user.permissions }, env.jwtSecret, { expiresIn: '1h' });
    return res.json({ success: true, data: { accessToken, expiresIn: 3600 } });
  } catch {
    return res.status(401).json({ success: false, error: { code: 'INVALID_REFRESH', message: 'Invalid refresh token' } });
  }
});

router.post('/logout', (_req, res) => res.json({ success: true, message: 'Logged out successfully' }));

export default router;
