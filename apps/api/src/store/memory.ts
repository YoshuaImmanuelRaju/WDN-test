import { v4 as uuid } from 'uuid';

export interface NetworkEntity {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  status: 'active' | 'processing' | 'error' | 'archived';
  nodeCount: number;
  pipeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationEntity {
  jobId: string;
  networkId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  createdAt: string;
}

export const db = {
  users: [
    {
      id: 'user-1',
      email: 'admin@water.local',
      password: '$2a$10$JQ4FJ0jUs9f7oOJPfm6D0.9bp4f9SExD1koRaSPo6e7iH730cdpJa', // password123
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      permissions: ['network:read', 'network:write', 'admin:read', 'admin:write'],
    },
  ],
  networks: [] as NetworkEntity[],
  simulations: [] as SimulationEntity[],
  createNetwork(input: Omit<NetworkEntity, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const network: NetworkEntity = { id: uuid(), createdAt: now, updatedAt: now, ...input };
    this.networks.push(network);
    return network;
  },
};
