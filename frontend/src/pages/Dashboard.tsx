// Purpose: Analytics dashboard for the user's farms.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, TrendingUp, Droplets, Leaf } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await api.get('/farms/');
        setFarms(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  if (isLoading) return <div className="text-center mt-20">Loading Dashboard...</div>;

  const totalArea = farms.reduce((acc, farm) => acc + (farm.area || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
        <Link to="/add-farm" className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors">
          <Plus size={20} />
          Add New Farm
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full"><MapPin className="text-primary" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Farms</p>
              <h3 className="text-2xl font-bold">{farms.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full"><TrendingUp className="text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Area</p>
              <h3 className="text-2xl font-bold">{totalArea.toFixed(2)} Acres</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full"><Droplets className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Irrigation</p>
              <h3 className="text-2xl font-bold">Active</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full"><Leaf className="text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Soil Health</p>
              <h3 className="text-2xl font-bold">Good</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Farm List */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">My Farms</h2>
      {farms.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't registered any farms yet.</p>
          <Link to="/add-farm" className="text-primary font-semibold hover:underline">Register your first farm here &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farms.map(farm => (
            <div key={farm.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
              {farm.images && farm.images.length > 0 ? (
                <img src={farm.images[0]} alt={farm.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-gray-900">{farm.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{farm.village}, {farm.district}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{farm.farmType}</span>
                  <span className="font-semibold">{farm.area} {farm.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
