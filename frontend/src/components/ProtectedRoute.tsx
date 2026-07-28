// Purpose: To prevent unauthenticated users from accessing certain pages (like Profile).
// How it works: Checks the AuthContext. If no user is logged in, redirects to /login.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If there's no token, send them to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
