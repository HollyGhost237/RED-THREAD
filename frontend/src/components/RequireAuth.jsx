// Version alternative de RequireAuth sans contexte
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}