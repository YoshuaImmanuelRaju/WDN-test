import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/User/Dashboard';
import Visualizer from './pages/User/Visualizer';
import DemandManager from './pages/User/DemandManager';
import ExportData from './pages/User/ExportData';
import AdminDashboard from './pages/Admin/Dashboard';
import AlgorithmManager from './pages/Admin/AlgorithmManager';
import EPANETSimulator from './pages/Admin/EPANETSimulator';
import KeyManagement from './pages/Admin/KeyManagement';
import ClusterAnalysis from './pages/Admin/ClusterAnalysis';
import WSNSimulator from './pages/User/WSNSimulator';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'user' | 'admin' }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return <>{children}</>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRole="user">
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="visualizer" element={<Visualizer />} />
                    <Route path="wsn" element={<WSNSimulator />} />
                    <Route path="demand" element={<DemandManager />} />
                    <Route path="export" element={<ExportData />} />
                    <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="algorithm" element={<AlgorithmManager />} />
                    <Route path="simulator" element={<EPANETSimulator />} />
                    <Route path="keys" element={<KeyManagement />} />
                    <Route path="analysis" element={<ClusterAnalysis />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
