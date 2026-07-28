import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface WeatherChartsProps {
  forecast: any[];
}

export const WeatherCharts = ({ forecast }: WeatherChartsProps) => {
  if (!forecast || forecast.length === 0) return null;

  // Transform data for charts
  const data = forecast.map(day => ({
    name: day.day,
    temp: day.temp_day,
    rain: day.rain_probability
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Temperature Trend Area Chart */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Temperature Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rainfall Probability Bar Chart */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Rainfall Probability (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
