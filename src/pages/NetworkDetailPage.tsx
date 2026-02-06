import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useNetworkStore } from '@/stores/networkStore';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { ArrowLeft, Play, Download, Settings } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { NetworkWithDetails } from '@/types';

export function NetworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentNetwork, setCurrentNetwork } = useNetworkStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadNetwork(id);
    }

    return () => {
      setCurrentNetwork(null);
    };
  }, [id]);

  const loadNetwork = async (networkId: string) => {
    try {
      const [networkRes, nodesRes, pipesRes, clustersRes] = await Promise.all([
        supabase
          .from('networks')
          .select('*')
          .eq('id', networkId)
          .single(),
        supabase
          .from('nodes')
          .select('*')
          .eq('network_id', networkId),
        supabase
          .from('pipes')
          .select('*')
          .eq('network_id', networkId),
        supabase
          .from('clusters')
          .select('*')
          .eq('network_id', networkId),
      ]);

      if (networkRes.error) throw networkRes.error;

      const networkData: NetworkWithDetails = {
        ...networkRes.data,
        nodes: nodesRes.data || [],
        pipes: pipesRes.data || [],
        clusters: clustersRes.data || [],
      };

      setCurrentNetwork(networkData);
    } catch (err: unknown) {
      console.error('Error loading network:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load network');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading network...</p>
        </div>
      </div>
    );
  }

  if (error || !currentNetwork) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Network Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested network could not be found.'}</p>
          <Link
            to="/networks"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Back to Networks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/networks"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentNetwork.name}</h1>
            <p className="text-gray-600">{currentNetwork.description || 'No description'}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2 shadow-md hover:shadow-lg">
            <Play className="w-4 h-4" />
            Run Simulation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Nodes</h3>
          <p className="text-3xl font-bold text-gray-900">{currentNetwork.node_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pipes</h3>
          <p className="text-3xl font-bold text-gray-900">{currentNetwork.pipe_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Clusters</h3>
          <p className="text-3xl font-bold text-gray-900">{currentNetwork.clusters?.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Status</h3>
          <p className="text-lg font-semibold text-green-600 capitalize">{currentNetwork.status}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-[600px]">
          <NetworkVisualization />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Details</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">File Type</dt>
            <dd className="text-sm text-gray-900 uppercase">{currentNetwork.file_type}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Version</dt>
            <dd className="text-sm text-gray-900">{currentNetwork.version}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Created</dt>
            <dd className="text-sm text-gray-900">{formatDate(currentNetwork.created_at)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600 mb-1">Last Updated</dt>
            <dd className="text-sm text-gray-900">{formatDate(currentNetwork.updated_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
