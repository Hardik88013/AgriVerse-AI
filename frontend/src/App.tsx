// Purpose: The main App component containing our routing logic.
// How it works: Uses React Router's BrowserRouter, Routes, and Route to determine which Page to show based on the URL.
// Why it exists: To orchestrate the entire frontend application and layout.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* The Navbar will appear on every single page */}
        <Navbar />
        
        <main className="flex-grow bg-light">
          {/* Routes dictate which component renders based on the path */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* The Footer will appear on every single page */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
