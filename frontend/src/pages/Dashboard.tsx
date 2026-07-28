// Purpose: Central Hub for the farmer. Aggregates KPI stats, Weather, and Charts.
import { useEffect, useState } from 'react';
import { MapPin, TrendingUp, Droplets, Leaf } from 'lucide-react';
import api from '../services/api';
import WeatherWidget from '../components/WeatherWidget';
import ForecastWidget from '../components/ForecastWidget';
import { WeatherCharts } from '../components/WeatherCharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalFarms: 0, totalArea: 0, activeAlerts: 0 });
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  
  const [weather, setWeather] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // 1. Fetch Dashboard Stats and list of farms
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, farmsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/farms/')
        ]);
        setStats(statsRes.data);
        setFarms(farmsRes.data);
        
        // Auto-select the first farm for weather
        if (farmsRes.data.length > 0) {
          setSelectedFarmId(farmsRes.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 2. Fetch Weather when a farm is selected
  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedFarmId) return;
      
      setIsWeatherLoading(true);
      try {
        const res = await api.get(`/weather/${selectedFarmId}`);
        setWeather(res.data);
      } catch (err) {
        console.error("Failed to load weather", err);
        setWeather(null);
      } finally {
        setIsWeatherLoading(false);
      }
    };
    
    fetchWeather();
  }, [selectedFarmId]);

  if (isStatsLoading) {
    return <div className="text-center mt-20 font-bold text-gray-500 animate-pulse">Loading Smart Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farm Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is your agriculture summary.</p>
        </div>
        
        {/* Farm Selector for Weather */}
        {farms.length > 0 && (
          <select 
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value)}
          >
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.village})</option>
            ))}
          </select>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full"><MapPin className="text-primary" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Farms</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalFarms}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full"><TrendingUp className="text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Area</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalArea.toFixed(1)} Acres</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full"><Droplets className="text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Irrigation Status</p>
              <h3 className="text-2xl font-bold text-gray-900">Optimal</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full"><Leaf className="text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Active Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeAlerts}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[300px]">
          <WeatherWidget weather={weather} isLoading={isWeatherLoading} />
        </div>
        <div className="lg:col-span-2 h-[300px]">
          <ForecastWidget forecast={weather?.forecast} isLoading={isWeatherLoading} />
        </div>
      </div>

      {/* Analytics Charts */}
      {weather && weather.forecast && (
        <div className="mt-8">
           <WeatherCharts forecast={weather.forecast} />
        </div>
      )}

    </div>
  );
};

export default Dashboard;
