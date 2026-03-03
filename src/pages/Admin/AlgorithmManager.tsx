import { useState } from 'react';
import { toast } from 'react-toastify';
import { Upload, FileCode, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface AlgorithmModule {
  id: string;
  name: string;
  uploadDate: string;
  version: string;
  status: 'active' | 'inactive';
  size: string;
}

export default function AlgorithmManager() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [modules, setModules] = useState<AlgorithmModule[]>([
    {
      id: '1',
      name: 'leak_detection_v2.py',
      uploadDate: '2025-09-28',
      version: '2.1.0',
      status: 'active',
      size: '156 KB'
    },
    {
      id: '2',
      name: 'pressure_optimizer.py',
      uploadDate: '2025-09-15',
      version: '1.8.3',
      status: 'active',
      size: '98 KB'
    },
    {
      id: '3',
      name: 'demand_forecaster.py',
      uploadDate: '2025-09-10',
      version: '1.5.0',
      status: 'inactive',
      size: '124 KB'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const newModule: AlgorithmModule = {
        id: Date.now().toString(),
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        version: '1.0.0',
        status: 'inactive',
        size: `${(file.size / 1024).toFixed(0)} KB`
      };
      setModules([newModule, ...modules]);
      toast.success(`Algorithm module "${file.name}" uploaded successfully`);
      setUploadedFile(null);
    }
  };

  const toggleStatus = (id: string) => {
    setModules(modules.map(m =>
      m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
    ));
    toast.success('Module status updated');
  };

  const deleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    toast.success('Module deleted successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Algorithm Manager</h1>
        <p className="text-gray-600 mt-1">Upload and manage algorithm modules</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Algorithm Module</span>
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition">
          <input
            type="file"
            accept=".py,.js,.ts,.r"
            onChange={handleFileUpload}
            className="hidden"
            id="algorithm-upload"
          />
          <label htmlFor="algorithm-upload" className="cursor-pointer">
            <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop algorithm file here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports .py, .js, .ts, .r files
            </p>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Uploaded Modules</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Module Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Version</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Upload Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-800">{module.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{module.version}</td>
                  <td className="py-3 px-4 text-gray-600">{module.uploadDate}</td>
                  <td className="py-3 px-4 text-gray-600">{module.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {module.status === 'active' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleStatus(module.id)}
                        className={`px-3 py-1 text-sm font-medium rounded transition ${
                          module.status === 'active'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {module.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteModule(module.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
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
          <p className="text-sm text-blue-700 font-medium mb-1">Total Modules</p>
          <p className="text-3xl font-bold text-blue-900">{modules.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium mb-1">Active Modules</p>
          <p className="text-3xl font-bold text-green-900">
            {modules.filter(m => m.status === 'active').length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 font-medium mb-1">Inactive Modules</p>
          <p className="text-3xl font-bold text-orange-900">
            {modules.filter(m => m.status === 'inactive').length}
          </p>
        </div>
      </div>
    </div>
  );
}
