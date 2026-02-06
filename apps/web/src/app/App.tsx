import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { NetworkList } from '../components/NetworkList';
import { useAuthStore } from '../stores/authStore';

function Dashboard() {
  return (
    <div>
      <h1>Water Distribution Portal</h1>
      <NetworkList />
    </div>
  );
}

export function App() {
  const token = useAuthStore((s) => s.accessToken);
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}
