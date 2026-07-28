from pydantic import BaseModel
from typing import List
from datetime import datetime

class DailyForecast(BaseModel):
    day: str
    temp_day: float
    temp_night: float
    description: str
    icon: str
    rain_probability: float

class WeatherResponse(BaseModel):
    """Schema for standardizing weather data returning to the frontend."""
    temperature: float
    humidity: int
    windSpeed: float
    windDirection: int
    pressure: int
    uvIndex: float
    visibility: int
    description: str
    icon: str
    is_mock: bool = False
    forecast: List[DailyForecast] = []
