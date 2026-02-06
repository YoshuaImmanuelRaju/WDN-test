/*
  # Water Distribution Portal Database Schema

  ## Overview
  Complete schema for water distribution network management system with:
  - User authentication and role-based access control
  - Network topology storage (nodes, pipes)
  - Cluster demand management
  - Simulation tracking and results
  - Leak detection alerts
  - Algorithm registry
  - Audit logging

  ## New Tables
  
  ### `profiles`
  - User profile information extending Supabase auth.users
  - `id` (uuid, FK to auth.users)
  - `first_name`, `last_name` (text)
  - `role` (enum: user, admin, super_admin)
  - `status` (enum: active, inactive, suspended)
  - Timestamps

  ### `networks`
  - Water distribution networks uploaded by users
  - `id` (uuid, PK)
  - `owner_id` (uuid, FK to profiles)
  - `name`, `description` (text)
  - `file_path`, `file_type` (text)
  - `node_count`, `pipe_count` (integer)
  - `metadata` (jsonb)
  - `status` (enum: active, processing, error, archived)
  - Timestamps

  ### `nodes`
  - Network nodes (junctions, tanks, reservoirs)
  - `id` (uuid, PK)
  - `network_id` (uuid, FK)
  - `node_id` (text, unique per network)
  - `type` (enum: junction, tank, reservoir, pump, valve)
  - `x_coord`, `y_coord`, `elevation` (decimal)
  - `base_demand`, `current_pressure`, `current_demand` (decimal)
  - `metadata` (jsonb)

  ### `pipes`
  - Connections between nodes
  - `id` (uuid, PK)
  - `network_id` (uuid, FK)
  - `pipe_id` (text, unique per network)
  - `from_node_id`, `to_node_id` (uuid, FK to nodes)
  - `length`, `diameter`, `roughness` (decimal)
  - `current_flow`, `current_velocity` (decimal)
  - `status` (enum: open, closed, cv)
  - `metadata` (jsonb)

  ### `clusters`
  - Demand management clusters
  - `id` (uuid, PK)
  - `network_id` (uuid, FK)
  - `name`, `description` (text)
  - `node_ids` (uuid array)
  - `head_node_id` (uuid, FK)
  - `demand`, `supply`, `efficiency` (decimal)
  - `status` (text)
  - Timestamps

  ### `cluster_keys`
  - Secure key management for clusters
  - `id` (uuid, PK)
  - `cluster_id` (uuid, FK)
  - `public_key`, `key_hash` (text)
  - `created_by` (uuid, FK)
  - `expires_at` (timestamp)
  - `status` (enum: active, revoked, expired)

  ### `simulations`
  - Simulation job tracking
  - `id` (uuid, PK)
  - `network_id` (uuid, FK)
  - `job_id` (text, unique)
  - `algorithm_id` (uuid)
  - `status` (enum: queued, running, completed, failed, cancelled)
  - `params`, `metadata` (jsonb)
  - `result_path`, `error_message` (text)
  - `progress` (integer)
  - `created_by` (uuid, FK)
  - Timestamps

  ### `simulation_results`
  - Detailed simulation results
  - `id` (uuid, PK)
  - `simulation_id` (uuid, FK)
  - `node_pressures`, `pipe_flows`, `leak_data` (jsonb)
  - `total_cost`, `efficiency_score` (decimal)
  - `metadata` (jsonb)

  ### `leak_alerts`
  - Leak detection alerts
  - `id` (uuid, PK)
  - `network_id` (uuid, FK)
  - `node_id` (uuid, FK)
  - `simulation_id` (uuid, FK)
  - `severity` (enum: low, medium, high, critical)
  - `location` (jsonb)
  - `description` (text)
  - `confidence` (decimal)
  - `status` (enum: new, acknowledged, resolved, false_positive)
  - `acknowledged_by` (uuid, FK)
  - Timestamps

  ### `algorithms`
  - Algorithm registry for admin management
  - `id` (uuid, PK)
  - `name`, `version` (text)
  - `file_path`, `description` (text)
  - `params_schema`, `default_params` (jsonb)
  - `status` (enum: active, inactive, deprecated)
  - `uploaded_by` (uuid, FK)
  - Timestamps

  ### `audit_logs`
  - System audit trail
  - `id` (uuid, PK)
  - `user_id` (uuid, FK)
  - `action`, `entity_type` (text)
  - `entity_id` (uuid)
  - `old_value`, `new_value` (jsonb)
  - `ip_address` (inet)
  - `user_agent` (text)
  - `created_at` (timestamp)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Admins have elevated permissions
  - Audit logging for compliance

  ## Indexes
  - Performance indexes on foreign keys
  - Search indexes on frequently queried fields
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE network_status AS ENUM ('active', 'processing', 'error', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE node_type AS ENUM ('junction', 'tank', 'reservoir', 'pump', 'valve');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pipe_status AS ENUM ('open', 'closed', 'cv');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE key_status AS ENUM ('active', 'revoked', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE simulation_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_status AS ENUM ('new', 'acknowledged', 'resolved', 'false_positive');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE algorithm_status AS ENUM ('active', 'inactive', 'deprecated');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  status user_status DEFAULT 'active' NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Networks table
CREATE TABLE IF NOT EXISTS networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('json', 'inp')),
  file_size BIGINT,
  node_count INTEGER DEFAULT 0,
  pipe_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  status network_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nodes table
CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  type node_type NOT NULL,
  x_coord DECIMAL(10, 2),
  y_coord DECIMAL(10, 2),
  elevation DECIMAL(10, 2),
  base_demand DECIMAL(10, 4),
  current_pressure DECIMAL(10, 4),
  current_demand DECIMAL(10, 4),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(network_id, node_id)
);

-- Pipes table
CREATE TABLE IF NOT EXISTS pipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  pipe_id TEXT NOT NULL,
  from_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  length DECIMAL(10, 2),
  diameter DECIMAL(10, 4),
  roughness DECIMAL(10, 4),
  current_flow DECIMAL(10, 4),
  current_velocity DECIMAL(10, 4),
  status pipe_status DEFAULT 'open' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(network_id, pipe_id)
);

-- Clusters table
CREATE TABLE IF NOT EXISTS clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  node_ids UUID[] DEFAULT ARRAY[]::UUID[],
  head_node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
  demand DECIMAL(10, 4) DEFAULT 0,
  supply DECIMAL(10, 4) DEFAULT 0,
  efficiency DECIMAL(5, 2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cluster keys table
CREATE TABLE IF NOT EXISTS cluster_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_id UUID NOT NULL REFERENCES clusters(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  status key_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  job_id TEXT UNIQUE NOT NULL,
  algorithm_id UUID,
  status simulation_status DEFAULT 'queued' NOT NULL,
  params JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  result_path TEXT,
  error_message TEXT,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simulation results table
CREATE TABLE IF NOT EXISTS simulation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  node_pressures JSONB DEFAULT '{}'::jsonb,
  pipe_flows JSONB DEFAULT '{}'::jsonb,
  leak_data JSONB DEFAULT '{}'::jsonb,
  total_cost DECIMAL(15, 2),
  efficiency_score DECIMAL(5, 2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leak alerts table
CREATE TABLE IF NOT EXISTS leak_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
  node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
  simulation_id UUID REFERENCES simulations(id) ON DELETE SET NULL,
  severity alert_severity NOT NULL,
  location JSONB,
  description TEXT,
  confidence DECIMAL(5, 2),
  status alert_status DEFAULT 'new' NOT NULL,
  acknowledged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Algorithms table
CREATE TABLE IF NOT EXISTS algorithms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  params_schema JSONB DEFAULT '{}'::jsonb,
  default_params JSONB DEFAULT '{}'::jsonb,
  status algorithm_status DEFAULT 'inactive' NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_networks_owner ON networks(owner_id);
CREATE INDEX IF NOT EXISTS idx_networks_status ON networks(status);
CREATE INDEX IF NOT EXISTS idx_nodes_network ON nodes(network_id);
CREATE INDEX IF NOT EXISTS idx_pipes_network ON pipes(network_id);
CREATE INDEX IF NOT EXISTS idx_pipes_from_node ON pipes(from_node_id);
CREATE INDEX IF NOT EXISTS idx_pipes_to_node ON pipes(to_node_id);
CREATE INDEX IF NOT EXISTS idx_clusters_network ON clusters(network_id);
CREATE INDEX IF NOT EXISTS idx_simulations_network ON simulations(network_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON simulations(status);
CREATE INDEX IF NOT EXISTS idx_simulations_created_by ON simulations(created_by);
CREATE INDEX IF NOT EXISTS idx_leak_alerts_network ON leak_alerts(network_id);
CREATE INDEX IF NOT EXISTS idx_leak_alerts_status ON leak_alerts(status);
CREATE INDEX IF NOT EXISTS idx_leak_alerts_severity ON leak_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_networks_updated_at ON networks;
CREATE TRIGGER update_networks_updated_at
  BEFORE UPDATE ON networks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clusters_updated_at ON clusters;
CREATE TRIGGER update_clusters_updated_at
  BEFORE UPDATE ON clusters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_algorithms_updated_at ON algorithms;
CREATE TRIGGER update_algorithms_updated_at
  BEFORE UPDATE ON algorithms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE leak_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE algorithms ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for networks
CREATE POLICY "Users can view own networks"
  ON networks FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own networks"
  ON networks FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own networks"
  ON networks FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own networks"
  ON networks FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all networks"
  ON networks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for nodes
CREATE POLICY "Users can view nodes of own networks"
  ON nodes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = nodes.network_id
      AND networks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage nodes of own networks"
  ON nodes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = nodes.network_id
      AND networks.owner_id = auth.uid()
    )
  );

-- RLS Policies for pipes
CREATE POLICY "Users can view pipes of own networks"
  ON pipes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = pipes.network_id
      AND networks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage pipes of own networks"
  ON pipes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = pipes.network_id
      AND networks.owner_id = auth.uid()
    )
  );

-- RLS Policies for clusters
CREATE POLICY "Users can view clusters of own networks"
  ON clusters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = clusters.network_id
      AND networks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage clusters of own networks"
  ON clusters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = clusters.network_id
      AND networks.owner_id = auth.uid()
    )
  );

-- RLS Policies for simulations
CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = simulations.network_id
      AND networks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create simulations for own networks"
  ON simulations FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = simulations.network_id
      AND networks.owner_id = auth.uid()
    )
  );

-- RLS Policies for simulation_results
CREATE POLICY "Users can view results of own simulations"
  ON simulation_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM simulations
      JOIN networks ON networks.id = simulations.network_id
      WHERE simulations.id = simulation_results.simulation_id
      AND (simulations.created_by = auth.uid() OR networks.owner_id = auth.uid())
    )
  );

-- RLS Policies for leak_alerts
CREATE POLICY "Users can view alerts for own networks"
  ON leak_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = leak_alerts.network_id
      AND networks.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can acknowledge alerts for own networks"
  ON leak_alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = leak_alerts.network_id
      AND networks.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM networks
      WHERE networks.id = leak_alerts.network_id
      AND networks.owner_id = auth.uid()
    )
  );

-- RLS Policies for algorithms
CREATE POLICY "All authenticated users can view active algorithms"
  ON algorithms FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage algorithms"
  ON algorithms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, status)
  VALUES (NEW.id, 'user', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();