import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NetworksPage } from '@/pages/NetworksPage';
import { UploadNetworkPage } from '@/pages/UploadNetworkPage';
import { NetworkDetailPage } from '@/pages/NetworkDetailPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ClustersPage } from '@/pages/ClustersPage';
import { AdminPage } from '@/pages/AdminPage';

function App() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/networks"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NetworksPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/networks/upload"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UploadNetworkPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/networks/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NetworkDetailPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AlertsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clusters"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClustersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <AdminPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
