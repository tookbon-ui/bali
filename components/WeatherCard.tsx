
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Thermometer } from 'lucide-react';

const WeatherCard: React.FC = () => {
  const [temp, setTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState<string>('晴朗');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 登巴薩座標: -8.6705, 115.2126
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-8.6705&longitude=115.2126&current_weather=true');
        const data = await res.json();
        setTemp(data.current_weather.temperature);
        
        const code = data.current_weather.weathercode;
        if (code === 0) setCondition('晴朗');
        else if (code <= 3) setCondition('多雲');
        else if (code <= 67) setCondition('有雨');
        else setCondition('陰天');

        setLoading(false);
      } catch (e) {
        console.error("Weather fetch failed", e);
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return (
    <div className="bg-[#438a84]/5 rounded-2xl p-4 animate-pulse flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
      <div className="h-4 bg-slate-200 w-24 rounded"></div>
    </div>
  );

  return (
    <div className="bg-[#438a84]/10 rounded-2xl p-4 flex items-center justify-between border border-[#438a84]/20">
      <div className="flex items-center gap-4">
        <div className="bg-white p-2.5 rounded-xl shadow-sm">
          {condition === '晴朗' ? <Sun className="text-orange-400" size={24} /> : 
           condition === '多雲' ? <Cloud className="text-slate-400" size={24} /> :
           <CloudRain className="text-blue-400" size={24} />}
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500">峇里島今日天氣</h3>
          <p className="text-xl font-bold text-[#2d5a57]">{condition}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pr-2">
        <Thermometer size={20} className="text-[#438a84]" />
        <span className="text-2xl font-black text-[#2d5a57]">{temp}°C</span>
      </div>
    </div>
  );
};

export default WeatherCard;
