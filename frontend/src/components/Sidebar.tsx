import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Sprout, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Farms', icon: <Map size={20} />, path: '/farms' }, // Future Phase
    { name: 'Crop Planning', icon: <Sprout size={20} />, path: '/crops' }, // Future Phase
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-2xl font-bold text-primary tracking-wider">
            AgriSense<span className="text-yellow-500">AI</span>
          </h1>
        </div>
        
        <div className="p-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-green-50 hover:text-primary'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
