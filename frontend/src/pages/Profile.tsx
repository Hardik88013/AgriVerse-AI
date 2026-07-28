// Purpose: User Profile Page.
// How it works: Protected route that displays the currently logged-in user's data.

import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary px-6 py-8 text-white text-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        
        <div className="p-8">
          {user ? (
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-gray-700">Name:</span> {user.name}</p>
              <p><span className="font-semibold text-gray-700">Email:</span> {user.email}</p>
              <p><span className="font-semibold text-gray-700">Role:</span> <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">{user.role}</span></p>
              
              <button 
                onClick={logout}
                className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
