// Purpose: Footer component displayed at the bottom of the page.
// How it works: A simple static UI component.
// Why it exists: To provide copyright info and secondary links consistently.

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold">AgriSense AI</span>
          <p className="text-gray-400 text-sm mt-1">Smart Agriculture Platform for the future.</p>
        </div>
        
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} AgriSense AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
