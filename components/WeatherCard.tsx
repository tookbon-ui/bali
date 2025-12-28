
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

const WeatherCard: React.FC = () => {
  const [temp, setTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState<string>('晴朗');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 峇里島烏布座標: -8.5069, 115.2625
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-8.5069&longitude=115.2625&current_weather=true');
        const data = await res.json();
        setTemp(Math.round(data.current_weather.temperature));
        
        const code = data.current_weather.weathercode;
        if (code === 0) setCondition('晴朗');
        else if (code <= 3) setCondition('多雲');
        else if (code <= 67) setCondition('微雨');
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
    <div className="bg-[#789d9a]/5 rounded-3xl p-4 animate-pulse h-20"></div>
  );

  return (
    <div className="bg-[#789d9a]/10 rounded-[30px] p-5 flex items-center justify-between border border-[#789d9a]/10 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="bg-white/80 p-3 rounded-2xl shadow-sm">
          {condition === '晴朗' ? <Sun className="text-amber-400" size={24} /> : 
           condition === '多雲' ? <Cloud className="text-slate-400" size={24} /> :
           <CloudRain className="text-cyan-500" size={24} />}
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bali Weather</h3>
          <p className="text-lg font-bold text-[#4a7c77]">{condition}</p>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-[#4a7c77]">{temp}</span>
        <span className="text-sm font-bold text-[#789d9a]">°C</span>
      </div>
    </div>
  );
};

export default WeatherCard;
