export type Role = 'user' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  permissions: string[];
}

export interface Network {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  nodeCount: number;
  pipeCount: number;
  status: 'active' | 'processing' | 'error' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Simulation {
  id: string;
  networkId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
}
