import { useState } from 'react';
import { Header } from './components/Header';
import { PresetButtons } from './components/PresetButtons';
import { RadarController, Preferences } from './components/RadarController';
import { DishRecommendation } from './components/DishRecommendation';

export default function App() {
  const [preferences, setPreferences] = useState<Preferences>({
    healthy: 5,
    simple: 5,
    difficulty: 5,
    quick: 5,
    vegetarian: 5,
    spicy: 5,
  });
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shouldUpdateRadarFromRecommendations, setShouldUpdateRadarFromRecommendations] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    // 这里可以添加主题切换逻辑
  };

  const handlePresetSelect = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    setShouldUpdateRadarFromRecommendations(true);
    setFetchTrigger(prev => prev + 1); // Increment trigger to force re-fetch
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* 动态背景 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 animate-gradient -z-10"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-50/50 via-transparent to-cyan-50/50 animate-pulse-color -z-10"></div>
      
      <div className="relative container mx-auto px-4 py-6 max-w-7xl">
        {/* 头部组件 */}
        <Header isDark={isDarkMode} onThemeToggle={handleThemeToggle} />

        {/* 预设配置按钮 */}
        <PresetButtons onPresetSelect={handlePresetSelect} />

        {/* 主要内容区域 */}
        <div className="space-y-8 lg:space-y-12">
          {/* 控制面板和推荐区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* 雷达控制器 */}
            <div className="lg:col-span-2">
              <RadarController
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
            </div>
            
            {/* 菜品推荐 */}
            <div className="lg:col-span-3">
              <DishRecommendation 
                preferences={preferences} 
                onPreferencesChange={setPreferences}
                shouldUpdateRadar={shouldUpdateRadarFromRecommendations}
                onRadarUpdated={() => setShouldUpdateRadarFromRecommendations(false)}
                fetchTrigger={fetchTrigger}
              />
            </div>
          </div>

          {/* 底部提示信息 */}
          <div className="text-center space-y-3 pt-8 border-t border-gradient-to-r from-transparent via-purple-200 to-transparent">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200">
                <span className="animate-pulse">💡</span>
                <span className="text-blue-700">实时智能推荐</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full border border-emerald-200">
                <span className="animate-bounce">👆</span>
                <span className="text-emerald-700">点击查看详细制作</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full border border-orange-200">
                <span className="animate-pulse">🎯</span>
                <span className="text-orange-700">个性化口味匹配</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ✨ 基于AI算法的美食推荐引擎 · 让每一餐都恰到好处 ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}