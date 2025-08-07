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
  simple: number;
  difficulty: number;
  quick: number;
  vegetarian: number;
  spicy: number;
}

interface RadarControllerProps {
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}

export function RadarController({ preferences, onPreferencesChange }: RadarControllerProps) {
  const radarData: PreferenceData[] = [
    { dimension: '健康', value: preferences.healthy, fullMark: 10 },
    { dimension: '简单', value: preferences.simple, fullMark: 10 },
    { dimension: '难度', value: preferences.difficulty, fullMark: 10 },
    { dimension: '快速', value: preferences.quick, fullMark: 10 },
    { dimension: '素食', value: preferences.vegetarian, fullMark: 10 },
    { dimension: '辛辣', value: preferences.spicy, fullMark: 10 },
  ];

  const handleSliderChange = (key: keyof Preferences, value: number[]) => {
    onPreferencesChange({
      ...preferences,
      [key]: value[0],
    });
  };

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
      key: 'simple' as keyof Preferences, 
      label: '制作简单', 
      value: preferences.simple, 
      emoji: '⚡',
      gradient: 'from-amber-500 to-yellow-400',
      color: '#f59e0b'
    },
    { 
      key: 'difficulty' as keyof Preferences, 
      label: '制作难度', 
      value: preferences.difficulty, 
      emoji: '🔥',
      gradient: 'from-red-500 to-orange-400',
      color: '#ef4444'
    },
    { 
      key: 'quick' as keyof Preferences, 
      label: '制作速度', 
      value: preferences.quick, 
      emoji: '⏱️',
      gradient: 'from-blue-500 to-cyan-400',
      color: '#3b82f6'
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
  ];

  return (
    <Card className="w-full h-fit bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border-2 border-blue-200 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-center sm:text-left bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-2xl animate-bounce">🎛️</span>
          口味偏好设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 雷达图 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
          <div className="relative h-48 sm:h-56 lg:h-64 bg-white/50 rounded-2xl p-4 border border-blue-200">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sliderConfigs.map(({ key, label, value, emoji, gradient, color }) => (
            <div key={key} className="space-y-3 p-4 bg-gradient-to-br from-white/80 to-gray-50/80 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <label className="text-sm sm:text-base flex items-center gap-2">
                  <span className="text-lg animate-pulse">{emoji}</span>
                  <span className="text-gray-700">{label}</span>
                </label>
                <span className={`
                  text-sm px-3 py-1 rounded-full text-white
                  bg-gradient-to-r ${gradient} shadow-lg
                `}>
                  {value}
                </span>
              </div>
              <div className="relative">
                <Slider
                  value={[value]}
                  onValueChange={(value) => handleSliderChange(key, value)}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                  style={{ 
                    '--slider-primary': color,
                  } as React.CSSProperties}
                />
                {/* 滑块进度背景 */}
                <div 
                  className={`absolute top-2 left-0 h-2 bg-gradient-to-r ${gradient} rounded-full transition-all duration-300`}
                  style={{ width: `${(value / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}