import React, { useMemo, useCallback } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';

export interface PreferenceData {
  dimension: string;
  value: number;
  fullMark: 10;
}

export interface Preferences {
  healthy: number;
  difficulty: number;
  vegetarian: number;
  spicy: number;
  sweetness: number;
}

interface RadarControllerProps {
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}

const RadarControllerComponent = ({ preferences, onPreferencesChange }: RadarControllerProps) => {
  const radarData: PreferenceData[] = useMemo(() => [
    { dimension: '健康', value: preferences.healthy, fullMark: 10 },
    { dimension: '制作难度', value: preferences.difficulty * 3.33, fullMark: 10 }, // 将1-3映射到10分制显示
    { dimension: '素食', value: preferences.vegetarian, fullMark: 10 },
    { dimension: '辛辣', value: preferences.spicy, fullMark: 10 },
    { dimension: '甜度', value: preferences.sweetness, fullMark: 10 },
  ], [preferences]);

  const handleSliderChange = useCallback((key: keyof Preferences, value: number[]) => {
    onPreferencesChange({
      ...preferences,
      [key]: value[0],
    });
  }, [preferences, onPreferencesChange]);

  const sliderConfigs = [
    { 
      key: 'healthy' as keyof Preferences, 
      label: '健康程度', 
      value: preferences.healthy, 
      emoji: '🥗',
      gradient: 'from-emerald-500 to-green-400',
      color: '#10b981'
    },
    { 
      key: 'difficulty' as keyof Preferences, 
      label: '制作难度', 
      value: preferences.difficulty, 
      emoji: '🔥',
      gradient: 'from-red-500 to-orange-400',
      color: '#ef4444',
      isDiscrete: true,
      discreteLabels: ['简单', '中等', '困难'],
      discreteValues: [1, 2, 3]
    },
    { 
      key: 'vegetarian' as keyof Preferences, 
      label: '素食偏好', 
      value: preferences.vegetarian, 
      emoji: '🥬',
      gradient: 'from-lime-500 to-green-500',
      color: '#84cc16'
    },
    { 
      key: 'spicy' as keyof Preferences, 
      label: '辛辣程度', 
      value: preferences.spicy, 
      emoji: '🌶️',
      gradient: 'from-rose-500 to-pink-400',
      color: '#f43f5e'
    },
    { 
      key: 'sweetness' as keyof Preferences, 
      label: '甜度偏好', 
      value: preferences.sweetness, 
      emoji: '🍯',
      gradient: 'from-pink-500 to-purple-400',
      color: '#ec4899'
    },
  ];

  return (
    <Card className="w-full h-fit backdrop-blur-sm border-2 shadow-xl transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-slate-800/90 dark:border-gray-600 bg-gradient-to-br from-white/90 to-blue-50/90 border-blue-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-center sm:text-left bg-clip-text text-transparent flex items-center gap-2 dark:bg-gradient-to-r dark:from-purple-400 dark:to-blue-400 bg-gradient-to-r from-purple-600 to-blue-600">
          <span className="text-2xl animate-bounce">🎛️</span>
          口味偏好设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 雷达图 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl blur-xl dark:bg-gradient-to-r dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10"></div>
          <div className="relative h-48 sm:h-56 lg:h-64 rounded-2xl p-4 border transition-all duration-300 dark:bg-gray-800/50 dark:border-gray-600 bg-white/50 border-blue-200">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  className="text-xs sm:text-sm"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={false}
                />
                <Radar
                  name="偏好"
                  dataKey="value"
                  stroke="url(#radarGradient)"
                  fill="url(#radarFill)"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 滑块控制器 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sliderConfigs.map(({ key, label, value, emoji, gradient, color, isDiscrete, discreteLabels, discreteValues }) => (
            <div key={key} className="group relative space-y-4 p-6 rounded-2xl border-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 dark:bg-gradient-to-br dark:from-gray-700/90 dark:to-gray-800/90 dark:border-gray-500 dark:hover:shadow-purple-900/30 dark:hover:border-gray-400 bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-300 hover:border-purple-300 hover:shadow-purple-200/50">
              {/* 背景光效 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 via-transparent to-purple-100/20 dark:from-gray-600/20 dark:to-purple-900/20"></div>
              
              <div className="relative flex items-center justify-between">
                <label className="text-sm sm:text-base flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">{emoji}</span>
                  <span className="font-medium dark:text-gray-100 text-gray-800 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">{label}</span>
                </label>
                <div className={`
                  relative text-sm font-bold px-4 py-2 rounded-xl text-white shadow-lg
                  bg-gradient-to-r ${gradient} 
                  group-hover:shadow-xl group-hover:scale-110 transition-all duration-300
                  before:absolute before:inset-0 before:rounded-xl before:bg-white/20 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
                `}>
                  <span className="relative z-10">{value}</span>
                </div>
              </div>
              
              <div className="relative space-y-2">
                {/* 滑块刻度背景 */}
                <div className="flex justify-between text-xs dark:text-gray-400 text-gray-500 px-1">
                  {isDiscrete ? (
                    discreteValues?.map((val, idx) => (
                      <span key={val} className={`transition-colors duration-300 ${value === val ? 'dark:text-purple-300 text-purple-600 font-medium' : ''}`}>
                        {discreteLabels?.[idx]}
                      </span>
                    ))
                  ) : (
                    [0, 2, 4, 6, 8, 10].map(num => (
                      <span key={num} className={`transition-colors duration-300 ${value >= num ? 'dark:text-purple-300 text-purple-600 font-medium' : ''}`}>
                        {num}
                      </span>
                    ))
                  )}
                </div>
                
                <div className="relative">
                  {/* 滑块轨道背景 */}
                  <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded-full shadow-inner"></div>
                  
                  {/* 动态进度条 */}
                  <div 
                    className={`absolute top-1/2 left-0 h-3 -translate-y-1/2 bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 shadow-lg`}
                    style={{ width: `${isDiscrete ? ((value - 1) / 2) * 100 : (value / 10) * 100}%` }}
                  >
                    {/* 进度条光效 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 via-white/10 to-transparent"></div>
                  </div>
                  
                  <Slider
                    value={[value]}
                    onValueChange={(value) => handleSliderChange(key, value)}
                    max={isDiscrete ? 3 : 10}
                    min={isDiscrete ? 1 : 0}
                    step={1}
                    className="relative w-full slider-enhanced z-10"
                    style={{ 
                      '--slider-primary': color,
                    } as React.CSSProperties}
                  />
                  
                  {/* 滑块发光效果 */}
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-md opacity-60 transition-all duration-500 bg-gradient-to-r ${gradient}`}
                    style={{ left: `calc(${isDiscrete ? ((value - 1) / 2) * 100 : (value / 10) * 100}% - 12px)` }}
                  ></div>
                </div>
                
                {/* 数值提示 */}
                <div className="text-center">
                  <span className="text-xs dark:text-gray-400 text-gray-500">
                    {isDiscrete ? 
                      (discreteLabels?.[discreteValues?.indexOf(value) || 0] || '') :
                      (value <= 3 ? '较低' : value <= 6 ? '中等' : value <= 8 ? '较高' : '很高')
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 使用 React.memo 优化性能
export const RadarController = React.memo(RadarControllerComponent);