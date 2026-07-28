import httpx
import logging
from datetime import datetime, timedelta
from database import get_database
from config import settings
from schemas.weather_schema import WeatherResponse, DailyForecast
import time

logger = logging.getLogger(__name__)

async def get_weather_for_farm(farm_id: str, lat: float, lon: float) -> WeatherResponse:
    """
    Fetches weather data for a specific farm.
    Implements Caching to prevent hitting external API rate limits.
    """
    db = get_database()
    
    # 1. Check Cache first
    cached_weather = await db.DashboardCache.find_one({"farm_id": farm_id})
    if cached_weather:
        # Check if expired manually (even though TTL index will delete it eventually)
        if cached_weather["expiresAt"] > datetime.utcnow():
            return WeatherResponse(**cached_weather["weather_data"])

    # 2. Cache Miss. Fetch from External API
    if settings.weather_api_key == "MOCK_KEY":
        # Return realistic mock data if user hasn't set up OpenWeather API key
        weather_data = get_mock_weather_data()
    else:
        try:
            weather_data = await fetch_openweathermap(lat, lon)
        except Exception as e:
            logger.error(f"Weather API failed: {e}")
            # Fallback to mock data to prevent dashboard crash
            weather_data = get_mock_weather_data()

    # 3. Save to Cache (TTL: 30 minutes)
    await db.DashboardCache.update_one(
        {"farm_id": farm_id},
        {
            "$set": {
                "lat": lat,
                "lng": lon,
                "weather_data": weather_data.model_dump(),
                "createdAt": datetime.utcnow(),
                "expiresAt": datetime.utcnow() + timedelta(minutes=30)
            }
        },
        upsert=True
    )
    
    # 4. Check for alerts and insert notifications (Infrastructure preview)
    if weather_data.temperature > 40:
        await generate_alert(farm_id, "Extreme Heat Warning", f"Temperature is {weather_data.temperature}°C. Increase irrigation.", "warning")
    elif weather_data.windSpeed > 30:
        await generate_alert(farm_id, "High Wind Alert", "Delay pesticide spraying.", "warning")

    return weather_data

async def fetch_openweathermap(lat: float, lon: float) -> WeatherResponse:
    """Calls OpenWeatherMap OneCall API."""
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&units=metric&appid={settings.weather_api_key}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        
        forecasts = []
        for day in data.get("daily", [])[:7]:
            # Convert unix timestamp to day string (e.g. "Mon")
            day_str = datetime.utcfromtimestamp(day["dt"]).strftime('%a')
            forecasts.append(DailyForecast(
                day=day_str,
                temp_day=day["temp"]["day"],
                temp_night=day["temp"]["night"],
                description=day["weather"][0]["main"],
                icon=day["weather"][0]["icon"],
                rain_probability=day.get("pop", 0) * 100
            ))
            
        return WeatherResponse(
            temperature=data["current"]["temp"],
            humidity=data["current"]["humidity"],
            windSpeed=data["current"]["wind_speed"],
            windDirection=data["current"]["wind_deg"],
            pressure=data["current"]["pressure"],
            uvIndex=data["current"]["uvi"],
            visibility=data["current"]["visibility"],
            description=data["current"]["weather"][0]["main"],
            icon=data["current"]["weather"][0]["icon"],
            is_mock=False,
            forecast=forecasts
        )

def get_mock_weather_data() -> WeatherResponse:
    """Returns static realistic data for testing without API keys."""
    return WeatherResponse(
        temperature=32.5,
        humidity=65,
        windSpeed=12.5,
        windDirection=180,
        pressure=1012,
        uvIndex=8.5,
        visibility=10000,
        description="Scattered Clouds",
        icon="03d",
        is_mock=True,
        forecast=[
            DailyForecast(day="Mon", temp_day=33, temp_night=25, description="Clear", icon="01d", rain_probability=0),
            DailyForecast(day="Tue", temp_day=34, temp_night=26, description="Clouds", icon="03d", rain_probability=10),
            DailyForecast(day="Wed", temp_day=31, temp_night=24, description="Rain", icon="10d", rain_probability=80),
            DailyForecast(day="Thu", temp_day=30, temp_night=23, description="Rain", icon="10d", rain_probability=90),
            DailyForecast(day="Fri", temp_day=32, temp_night=24, description="Clouds", icon="04d", rain_probability=20),
            DailyForecast(day="Sat", temp_day=34, temp_night=25, description="Clear", icon="01d", rain_probability=5),
            DailyForecast(day="Sun", temp_day=35, temp_night=26, description="Clear", icon="01d", rain_probability=0),
        ]
    )

async def generate_alert(farm_id: str, title: str, message: str, alert_type: str):
    """Helper to insert notification into DB. Requires fetching farm to find owner_id."""
    db = get_database()
    farm = await db.farms.find_one({"_id": farm_id} if isinstance(farm_id, str) else {"_id": farm_id})
    if not farm: return
    
    # Check if we already alerted this user recently to prevent spam
    recent = await db.notifications.find_one({
        "user_id": farm["owner_id"],
        "title": title,
        "createdAt": {"$gte": datetime.utcnow() - timedelta(hours=12)}
    })
    if recent: return
    
    await db.notifications.insert_one({
        "user_id": farm["owner_id"],
        "title": title,
        "message": message,
        "type": alert_type,
        "isRead": False,
        "createdAt": datetime.utcnow()
    })
