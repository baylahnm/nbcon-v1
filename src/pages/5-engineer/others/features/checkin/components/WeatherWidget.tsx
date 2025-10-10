import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge
} from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // Percentage
  windSpeed: number; // km/h
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "clear";
  visibility: number; // km
  pressure: number; // hPa
  uvIndex: number;
  locationName: string;
}

interface WeatherWidgetProps {
  projectLocation?: string;
  coordinates?: { lat: number; lng: number };
}

export function WeatherWidget({ projectLocation, coordinates }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    feelsLike: 31,
    humidity: 45,
    windSpeed: 15,
    condition: "sunny",
    visibility: 10,
    pressure: 1013,
    uvIndex: 8,
    locationName: projectLocation || "Riyadh, Saudi Arabia"
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In production, fetch real weather data from API
    // For now, we simulate with mock data
    const fetchWeather = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock weather based on location
        const mockWeather: WeatherData = {
          temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
          feelsLike: Math.floor(Math.random() * 15) + 23,
          humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
          windSpeed: Math.floor(Math.random() * 25) + 5, // 5-30 km/h
          condition: ["sunny", "cloudy", "clear"][Math.floor(Math.random() * 3)] as any,
          visibility: 10,
          pressure: 1013,
          uvIndex: Math.floor(Math.random() * 5) + 5, // 5-10
          locationName: projectLocation || "Riyadh, Saudi Arabia"
        };
        
        setWeather(mockWeather);
        setIsLoading(false);
      }, 500);
    };

    if (coordinates || projectLocation) {
      fetchWeather();
    }
  }, [coordinates, projectLocation]);

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="w-12 h-12 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-12 h-12 text-gray-500" />;
      case "rainy":
        return <CloudRain className="w-12 h-12 text-blue-500" />;
      case "stormy":
        return <CloudSnow className="w-12 h-12 text-purple-500" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 40) return "text-red-600";
    if (temp >= 35) return "text-orange-600";
    if (temp >= 25) return "text-yellow-600";
    return "text-blue-600";
  };

  const getUVIndexBadge = (uv: number) => {
    if (uv >= 8) return { label: "Very High", className: "bg-red-500/10 text-red-600 border-red-500/20" };
    if (uv >= 6) return { label: "High", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
    if (uv >= 3) return { label: "Moderate", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" };
    return { label: "Low", className: "bg-green-500/10 text-green-600 border-green-500/20" };
  };

  const uvBadge = getUVIndexBadge(weather.uvIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getWeatherIcon()}
            <div>
              <div className="text-xl">Weather Conditions</div>
              <div className="text-sm font-normal text-muted-foreground">{weather.locationName}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getTemperatureColor(weather.temperature)}`}>
              {weather.temperature}°C
            </div>
            <div className="text-sm text-muted-foreground">
              Feels like {weather.feelsLike}°C
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Humidity */}
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Droplets className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="text-xl font-bold">{weather.humidity}%</div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="flex items-center gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Wind className="w-8 h-8 text-cyan-600" />
            <div>
              <div className="text-sm text-muted-foreground">Wind</div>
              <div className="text-xl font-bold">{weather.windSpeed} km/h</div>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Eye className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="text-xl font-bold">{weather.visibility} km</div>
            </div>
          </div>

          {/* UV Index */}
          <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <Sun className="w-8 h-8 text-orange-600" />
            <div>
              <div className="text-sm text-muted-foreground">UV Index</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">{weather.uvIndex}</div>
                <Badge variant="outline" className={uvBadge.className + " text-xs"}>
                  {uvBadge.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weather.temperature >= 40 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <Thermometer className="w-4 h-4" />
              <span className="text-sm font-semibold">Extreme Heat Warning</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Temperature exceeds 40°C. Ensure adequate hydration and take regular breaks.
            </p>
          </div>
        )}

        {weather.uvIndex >= 8 && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600">
              <Sun className="w-4 h-4" />
              <span className="text-sm font-semibold">High UV Exposure</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use sunscreen and protective clothing. Limit exposure during peak hours (10 AM - 4 PM).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

