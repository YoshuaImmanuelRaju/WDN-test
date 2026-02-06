import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Network, Plus, Search, Upload } from 'lucide-react';
import { formatDate, formatFileSize, getStatusColor } from '@/lib/utils';
import type { Network as NetworkType } from '@/types';

export function NetworksPage() {
  const { profile } = useAuthStore();
  const [networks, setNetworks] = useState<NetworkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNetworks();
  }, [profile]);

  const loadNetworks = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .eq('owner_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNetworks(data || []);
    } catch (error) {
      console.error('Error loading networks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    network.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading networks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Networks</h1>
          <p className="text-gray-600">Manage your water distribution networks</p>
        </div>
        <Link
          to="/networks/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Upload className="w-5 h-5" />
          Upload Network
        </Link>
      </div>

      {networks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No networks yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by uploading your first water distribution network file.
          </p>
          <Link
            to="/networks/upload"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Network
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search networks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNetworks.map((network) => (
              <Link
                key={network.id}
                to={`/networks/${network.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                      <Network className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(network.status)}`}>
                      {network.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {network.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {network.description || 'No description provided'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nodes</p>
                      <p className="text-lg font-semibold text-gray-900">{network.node_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pipes</p>
                      <p className="text-lg font-semibold text-gray-900">{network.pipe_count}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Type:</span>
                      <span className="uppercase font-medium">{network.file_type}</span>
                    </div>
                    {network.file_size && (
                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{formatFileSize(network.file_size)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span className="font-medium">{formatDate(network.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
