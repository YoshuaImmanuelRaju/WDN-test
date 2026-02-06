import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import networkRoutes from './modules/network/network.routes';
import simulationRoutes from './modules/simulation/simulation.routes';
import clusterRoutes from './modules/cluster/cluster.routes';
import alertRoutes from './modules/alert/alert.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/networks', networkRoutes);
app.use('/api/v1', simulationRoutes);
app.use('/api/v1', clusterRoutes);
app.use('/api/v1', alertRoutes);
app.use('/api/v1', adminRoutes);

app.listen(env.port, () => console.log(`API running on :${env.port}`));
