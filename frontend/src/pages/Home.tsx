// Purpose: The landing page of our application.
// How it works: Uses Tailwind CSS to create a beautiful hero section.
// Why it exists: First impressions matter! This welcomes the user to the platform.

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-dark mb-6">
        Welcome to <span className="text-primary">AgriSense AI</span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-10">
        Empowering farmers with state-of-the-art Artificial Intelligence for crop recommendation and disease detection.
      </p>
      
      <div className="space-x-4">
        <Link to="/features" className="bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
          Explore Features
        </Link>
        <Link to="/about" className="bg-white text-primary border-2 border-primary hover:bg-gray-50 font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home;
