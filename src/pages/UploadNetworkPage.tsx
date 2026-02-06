import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export function UploadNetworkPage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext !== 'json' && ext !== 'inp') {
        setError('Please upload a JSON or INP file');
        setFile(null);
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');

      if (!name) {
        setName(selectedFile.name.replace(/\.(json|inp)$/i, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !profile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('networks')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const networkData = {
        owner_id: profile.id,
        name,
        description,
        file_path: uploadData.path,
        file_type: fileExt === 'json' ? 'json' : 'inp',
        file_size: file.size,
        status: 'processing',
      };

      const { data: network, error: dbError } = await supabase
        .from('networks')
        .insert(networkData)
        .select()
        .single();

      if (dbError) throw dbError;

      if (fileExt === 'json') {
        const text = await file.text();
        const networkJson = JSON.parse(text);

        if (networkJson.nodes && networkJson.pipes) {
          const nodes = networkJson.nodes.map((node: any) => ({
            network_id: network.id,
            node_id: node.id,
            type: node.type || 'junction',
            x_coord: node.x || 0,
            y_coord: node.y || 0,
            elevation: node.elevation || 0,
            base_demand: node.demand || 0,
          }));

          const { error: nodesError } = await supabase
            .from('nodes')
            .insert(nodes);

          if (nodesError) throw nodesError;

          const pipes = networkJson.pipes.map((pipe: any) => ({
            network_id: network.id,
            pipe_id: pipe.id,
            from_node_id: nodes.find((n: any) => n.node_id === pipe.from)?.id,
            to_node_id: nodes.find((n: any) => n.node_id === pipe.to)?.id,
            length: pipe.length || 0,
            diameter: pipe.diameter || 0,
            roughness: pipe.roughness || 100,
          }));

          const { error: pipesError } = await supabase
            .from('pipes')
            .insert(pipes);

          if (pipesError) throw pipesError;

          await supabase
            .from('networks')
            .update({
              node_count: nodes.length,
              pipe_count: pipes.length,
              status: 'active',
            })
            .eq('id', network.id);
        }
      }

      navigate(`/networks/${network.id}`);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during upload');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Network</h1>
        <p className="text-gray-600">Upload a water distribution network file (JSON or INP format)</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <input
                type="file"
                accept=".json,.inp"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  file ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  {file ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">
                  JSON or INP format, up to 50MB
                </p>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Network Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter network name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe this network..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/networks')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              {uploading ? 'Uploading...' : 'Upload Network'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Supported Formats
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">.json</span>
            <span>GeoJSON or custom JSON format with nodes and pipes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-xs">.inp</span>
            <span>EPANET input file format</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
