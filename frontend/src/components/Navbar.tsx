// Purpose: Main navigation bar for the application.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              AgriSense<span className="text-yellow-300">AI</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-yellow-200 transition-colors">Home</Link>
            <Link to="/features" className="hover:text-yellow-200 transition-colors">Features</Link>
            <Link to="/about" className="hover:text-yellow-200 transition-colors">About</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="font-semibold text-yellow-100 hover:text-white">Dashboard</Link>
                <Link to="/profile" className="font-semibold text-yellow-100 hover:text-white">Profile ({user.name})</Link>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-yellow-200 transition-colors">Log In</Link>
                <Link to="/register" className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded font-bold transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
