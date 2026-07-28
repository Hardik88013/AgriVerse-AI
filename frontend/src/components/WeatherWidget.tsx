import { Cloud, Droplets, Wind, Sun } from 'lucide-react';

interface WeatherWidgetProps {
  weather: any;
  isLoading: boolean;
}

const WeatherWidget = ({ weather, isLoading }: WeatherWidgetProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-16 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
        <Cloud size={48} className="text-gray-300 mb-2" />
        <p>Weather data unavailable.</p>
        <p className="text-xs mt-1">Please select a farm with valid GPS coordinates.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white h-full flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background icon */}
      <Cloud className="absolute -right-10 -top-10 text-white opacity-10 w-48 h-48" />
      
      <div>
        <div className="flex justify-between items-start mb-2 relative z-10">
          <div>
            <h3 className="text-lg font-medium opacity-90">Current Weather</h3>
            <p className="text-4xl font-bold mt-1">{weather.temperature}°C</p>
            <p className="text-sm font-medium capitalize mt-1">{weather.description}</p>
          </div>
          {weather.icon && (
             <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather" className="w-16 h-16 drop-shadow-md" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
        <div className="flex items-center gap-2">
          <Droplets size={18} className="opacity-80" />
          <div>
            <p className="text-xs opacity-80">Humidity</p>
            <p className="text-sm font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={18} className="opacity-80" />
          <div>
            <p className="text-xs opacity-80">Wind</p>
            <p className="text-sm font-semibold">{weather.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Sun size={18} className="opacity-80" />
          <div>
            <p className="text-xs opacity-80">UV Index</p>
            <p className="text-sm font-semibold">{weather.uvIndex}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Cloud size={18} className="opacity-80" />
          <div>
            <p className="text-xs opacity-80">Pressure</p>
            <p className="text-sm font-semibold">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
      
      {weather.is_mock && (
        <p className="text-xs text-center text-blue-200 mt-2 opacity-70">Using Mock Data</p>
      )}
    </div>
  );
};

export default WeatherWidget;
