import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationDropdown from '../components/NotificationDropdown';
import { useAuth } from '../hooks/useAuth';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-end px-6 md:px-10 z-10">
          <div className="flex items-center gap-6">
            <NotificationDropdown />
            
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold cursor-pointer relative group">
                {user?.name?.charAt(0)}
                {/* Simple Dropdown on hover */}
                <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block border">
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
