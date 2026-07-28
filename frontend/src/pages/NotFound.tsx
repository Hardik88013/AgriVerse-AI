// Purpose: 404 Catch-all page.
// How it works: Rendered when the user types a URL that doesn't exist in our React Router.
// Why it exists: Better UX than a blank screen or a default server error.

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-dark mt-4 mb-6">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
