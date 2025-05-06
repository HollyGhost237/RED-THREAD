import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home'
import Recette from './pages/Recette'
import Plantes from './pages/Plantes'
import Blog from './pages/Blog'
import Forum from './pages/Forum'
import Register from './pages/register'
import Login from './pages/login'
import UserDashboard from './pages/UserDashboard'
import VerificationPending from './pages/VerificationPending'
import PendingProfessionals from './components/PendingProfessionals';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './layouts/AdminLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Déplacé à l'intérieur de BrowserRouter */}
        <Routes>
          {/* Routes avec layout complet */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="recettes" element={<Recette />} />
            <Route path="plantes" element={<Plantes />} />
            <Route path="blog" element={<Blog />} />
            <Route path="forum" element={<Forum />} />
            <Route path='dashboard' element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            } />
          </Route>

          {/* Routes sans navbar/footer */}
          <Route element={<AuthLayout />}>
            <Route path='register' element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="verification-pending" element={<VerificationPending />} />
          </Route>

          {/* Routes admin */}
          <Route 
            path="/admin/*" 
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="professionals" element={<PendingProfessionals />} />
            <Route index element={<Navigate to="professionals" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}