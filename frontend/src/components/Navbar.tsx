// Purpose: Main navigation bar for the application.
// How it works: Uses React Router's <Link> component to navigate without reloading the page.
// Why it exists: To provide a consistent header across all pages.

import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              AgriSense<span className="text-yellow-300">AI</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-yellow-200 transition-colors">Home</Link>
            <Link to="/features" className="hover:text-yellow-200 transition-colors">Features</Link>
            <Link to="/about" className="hover:text-yellow-200 transition-colors">About</Link>
          </div>
          
          {/* Mobile Menu Button (Placeholder for future) */}
          <div className="md:hidden flex items-center">
            <button className="text-white hover:text-yellow-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
