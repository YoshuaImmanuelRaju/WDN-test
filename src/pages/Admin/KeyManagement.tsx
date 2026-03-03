import { useState } from 'react';
import { toast } from 'react-toastify';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';

interface ClusterKey {
  id: string;
  clusterId: string;
  clusterName: string;
  key: string;
  createdDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

export default function KeyManagement() {
  const [keys, setKeys] = useState<ClusterKey[]>([
    {
      id: '1',
      clusterId: 'C1',
      clusterName: 'Cluster 1',
      key: 'ck_live_a3f8d92c1e4b6f7a9d2e5c8b1f4a7d3e',
      createdDate: '2025-09-15',
      expiryDate: '2026-09-15',
      status: 'active'
    },
    {
      id: '2',
      clusterId: 'C2',
      clusterName: 'Cluster 2',
      key: 'ck_live_b7e9f1a3d5c8b2f6a4e7d9c1b8f3a5e2',
      createdDate: '2025-09-10',
      expiryDate: '2026-09-10',
      status: 'active'
    }
  ]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const generateKey = () => {
    const newKey: ClusterKey = {
      id: Date.now().toString(),
      clusterId: `C${keys.length + 1}`,
      clusterName: `Cluster ${keys.length + 1}`,
      key: `ck_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };
    setKeys([newKey, ...keys]);
    toast.success('New cluster key generated successfully');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('Key copied to clipboard');
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
    toast.success('Key deleted successfully');
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 12)}${'*'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Key Management</h1>
          <p className="text-gray-600 mt-1">Manage cluster access keys</p>
        </div>
        <button
          onClick={generateKey}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Generate New Key</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Active Cluster Keys</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cluster</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Access Key</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expires</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((keyItem) => (
                <tr key={keyItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">{keyItem.clusterName}</p>
                        <p className="text-xs text-gray-500">{keyItem.clusterId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">
                      {visibleKeys.has(keyItem.id) ? keyItem.key : maskKey(keyItem.key)}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{keyItem.createdDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{keyItem.expiryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      keyItem.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {keyItem.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleKeyVisibility(keyItem.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                        title={visibleKeys.has(keyItem.id) ? 'Hide key' : 'Show key'}
                      >
                        {visibleKeys.has(keyItem.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyKey(keyItem.key)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Copy key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteKey(keyItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Keys</p>
              <p className="text-3xl font-bold text-blue-900">{keys.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Active Keys</p>
              <p className="text-3xl font-bold text-green-900">
                {keys.filter(k => k.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-red-700 font-medium">Expired Keys</p>
              <p className="text-3xl font-bold text-red-900">
                {keys.filter(k => k.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Key Security Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Never share cluster keys publicly or commit them to version control</li>
          <li>• Rotate keys regularly for enhanced security</li>
          <li>• Use separate keys for different environments</li>
          <li>• Monitor key usage and revoke compromised keys immediately</li>
        </ul>
      </div>
    </div>
  );
}
