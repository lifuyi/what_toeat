import React from 'react';
import { Button } from './ui/button';
import { Preferences } from './RadarController';

interface PresetConfig {
  name: string;
  emoji: string;
  description: string;
  preferences: Preferences;
  gradient: string;
}

interface PresetButtonsProps {
  onPresetSelect: (preferences: Preferences) => void;
  onRandomRecommend?: () => void;
}

const presets: PresetConfig[] = [
  {
    name: '健康达人',
    emoji: '🥗',
    description: '注重营养均衡',
    preferences: { healthy: 10, simple: 6, difficulty: 4, quick: 5, vegetarian: 8, spicy: 2 },
    gradient: 'from-emerald-500 to-green-400'
  },
  {
    name: '快手料理',
    emoji: '⚡',
    description: '简单快速制作',
    preferences: { healthy: 6, simple: 10, difficulty: 2, quick: 10, vegetarian: 5, spicy: 4 },
    gradient: 'from-amber-500 to-orange-400'
  },
  {
    name: '素食主义',
    emoji: '🥬',
    description: '纯素食菜品',
    preferences: { healthy: 9, simple: 5, difficulty: 5, quick: 6, vegetarian: 10, spicy: 3 },
    gradient: 'from-lime-500 to-green-500'
  },
  {
    name: '重口味',
    emoji: '🌶️',
    description: '香辣刺激',
    preferences: { healthy: 4, simple: 6, difficulty: 7, quick: 5, vegetarian: 3, spicy: 10 },
    gradient: 'from-red-500 to-pink-500'
  },
  {
    name: '精致烹饪',
    emoji: '👨‍🍳',
    description: '复杂精美菜品',
    preferences: { healthy: 7, simple: 3, difficulty: 9, quick: 3, vegetarian: 4, spicy: 5 },
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    name: '均衡口味',
    emoji: '⚖️',
    description: '中等偏好',
    preferences: { healthy: 5, simple: 5, difficulty: 5, quick: 5, vegetarian: 5, spicy: 5 },
    gradient: 'from-blue-500 to-cyan-500'
  }
];

const PresetButtonsComponent = ({ onPresetSelect, onRandomRecommend }: PresetButtonsProps) => {
  // 生成随机偏好设置
  const generateRandomPreferences = (): Preferences => {
    return {
      healthy: Math.floor(Math.random() * 10) + 1,
      simple: Math.floor(Math.random() * 10) + 1,
      difficulty: Math.floor(Math.random() * 10) + 1,
      quick: Math.floor(Math.random() * 10) + 1,
      vegetarian: Math.floor(Math.random() * 10) + 1,
      spicy: Math.floor(Math.random() * 10) + 1,
    };
  };

  const handlePresetSelect = (preferences: Preferences) => {
    // 清除搜索状态，切换到偏好推荐模式
    localStorage.removeItem('ingredientSearch');
    onPresetSelect(preferences);
  };

  const handleRandomRecommend = () => {
    const randomPreferences = generateRandomPreferences();
    // 清除搜索状态，切换到偏好推荐模式
    localStorage.removeItem('ingredientSearch');
    onPresetSelect(randomPreferences);
    if (onRandomRecommend) {
      onRandomRecommend();
    }
  };
  return (
    <div className="mb-6">
      <h3 className="text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        🎯 快速预设配置
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            onClick={() => handlePresetSelect(preset.preferences)}
            className={`
              relative h-auto p-3 bg-gradient-to-br ${preset.gradient} 
              text-white border-0 hover:scale-105 transform transition-all duration-300
              hover:shadow-lg hover:shadow-current/25 group overflow-hidden
            `}
          >
            {/* 背景动画 */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex flex-col items-center gap-1 text-center">
              <span className="text-lg animate-bounce group-hover:animate-pulse">
                {preset.emoji}
              </span>
              <span className="text-xs font-medium">{preset.name}</span>
              <span className="text-xs opacity-90 leading-tight">
                {preset.description}
              </span>
            </div>
          </Button>
        ))}
        
        {/* 随机推荐按钮 */}
        <Button
          variant="outline"
          onClick={handleRandomRecommend}
          className="
            relative h-auto p-3 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600
            text-white border-0 hover:scale-105 transform transition-all duration-300
            hover:shadow-lg hover:shadow-purple-500/25 group overflow-hidden
          "
        >
          {/* 背景动画 */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex flex-col items-center gap-1 text-center">
            <span className="text-lg animate-spin group-hover:animate-bounce">
              🎲
            </span>
            <span className="text-xs font-medium">随机推荐</span>
            <span className="text-xs opacity-90 leading-tight">
              惊喜美食
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

// 使用 React.memo 优化性能
export const PresetButtons = React.memo(PresetButtonsComponent);