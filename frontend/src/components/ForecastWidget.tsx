import { CloudRain } from 'lucide-react';

interface ForecastWidgetProps {
  forecast: any[];
  isLoading: boolean;
}

const ForecastWidget = ({ forecast, isLoading }: ForecastWidgetProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex gap-4 overflow-x-hidden">
          {[1,2,3,4,5].map(i => (
             <div key={i} className="h-24 w-16 bg-gray-200 rounded-lg shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">7-Day Forecast</h3>
      
      {/* Horizontal scrolling container for mobile, flex for desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {forecast.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 min-w-[80px] flex-1 hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{day.day}</span>
            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="icon" className="w-10 h-10 my-1" />
            <div className="text-center">
              <span className="text-sm font-bold text-gray-900 block">{Math.round(day.temp_day)}°</span>
              <span className="text-xs text-gray-500 block">{Math.round(day.temp_night)}°</span>
            </div>
            {day.rain_probability > 10 && (
              <div className="flex items-center gap-1 mt-2 text-blue-500">
                <CloudRain size={10} />
                <span className="text-[10px] font-bold">{day.rain_probability}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastWidget;
