export type UserRole = 'user' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type NetworkStatus = 'active' | 'processing' | 'error' | 'archived';
export type NodeType = 'junction' | 'tank' | 'reservoir' | 'pump' | 'valve';
export type PipeStatus = 'open' | 'closed' | 'cv';
export type SimulationStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'false_positive';
export type AlgorithmStatus = 'active' | 'inactive' | 'deprecated';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  status: UserStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Network {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: 'json' | 'inp';
  file_size: number | null;
  node_count: number;
  pipe_count: number;
  metadata: Record<string, unknown>;
  version: number;
  status: NetworkStatus;
  created_at: string;
  updated_at: string;
}

export interface Node {
  id: string;
  network_id: string;
  node_id: string;
  type: NodeType;
  x_coord: number | null;
  y_coord: number | null;
  elevation: number | null;
  base_demand: number | null;
  current_pressure: number | null;
  current_demand: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Pipe {
  id: string;
  network_id: string;
  pipe_id: string;
  from_node_id: string;
  to_node_id: string;
  length: number | null;
  diameter: number | null;
  roughness: number | null;
  current_flow: number | null;
  current_velocity: number | null;
  status: PipeStatus;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Cluster {
  id: string;
  network_id: string;
  name: string;
  description: string | null;
  node_ids: string[];
  head_node_id: string | null;
  demand: number;
  supply: number;
  efficiency: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Simulation {
  id: string;
  network_id: string;
  job_id: string;
  algorithm_id: string | null;
  status: SimulationStatus;
  params: Record<string, unknown>;
  metadata: Record<string, unknown>;
  result_path: string | null;
  error_message: string | null;
  progress: number;
  started_at: string | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
}

export interface SimulationResult {
  id: string;
  simulation_id: string;
  node_pressures: Record<string, number>;
  pipe_flows: Record<string, number>;
  leak_data: Record<string, unknown>;
  total_cost: number | null;
  efficiency_score: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LeakAlert {
  id: string;
  network_id: string;
  node_id: string | null;
  simulation_id: string | null;
  severity: AlertSeverity;
  location: {
    x?: number;
    y?: number;
    nodeId?: string;
  } | null;
  description: string | null;
  confidence: number | null;
  status: AlertStatus;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface Algorithm {
  id: string;
  name: string;
  version: string;
  file_path: string;
  description: string | null;
  params_schema: Record<string, unknown>;
  default_params: Record<string, unknown>;
  status: AlgorithmStatus;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface NetworkWithDetails extends Network {
  nodes?: Node[];
  pipes?: Pipe[];
  clusters?: Cluster[];
}

export interface CreateNetworkInput {
  name: string;
  description?: string;
  file: File;
}

export interface UpdateNetworkInput {
  name?: string;
  description?: string;
  status?: NetworkStatus;
}

export interface CreateSimulationInput {
  network_id: string;
  algorithm_id?: string;
  params?: Record<string, unknown>;
}

export interface CreateClusterInput {
  network_id: string;
  name: string;
  description?: string;
  node_ids: string[];
  head_node_id?: string;
  demand: number;
}

export interface UpdateClusterInput {
  name?: string;
  description?: string;
  demand?: number;
  supply?: number;
}
