import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { PresetButtons } from './components/PresetButtons';
import { Preferences } from './components/RadarController';

// 懒加载重型组件
const IngredientSearch = lazy(() => import('./components/IngredientSearch').then(module => ({ default: module.IngredientSearch })));
const RadarController = lazy(() => import('./components/RadarController').then(module => ({ default: module.RadarController })));
const DishRecommendation = lazy(() => import('./components/DishRecommendation').then(module => ({ default: module.DishRecommendation })));

export default function App() {
  const [preferences, setPreferences] = useState<Preferences>({
    healthy: 5,
    difficulty: 2,
    vegetarian: 5,
    spicy: 5,
    sweetness: 5,
  });
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 从localStorage读取深色模式设置
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved ? saved === 'true' : prefersDark;
  });
  

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // 保存到localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // 更新document类名
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handlePresetSelect = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    setFetchTrigger(prev => prev + 1); // Increment trigger to force re-fetch
  };

  const handlePreferencesChange = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    // 推荐只在用户需要时触发搜索；这里仅切换回推荐模式并刷新
    localStorage.removeItem('ingredientSearch');
    // debounce fetchTrigger bumps to avoid rapid bursts
    window.clearTimeout((window as any).__prefFetchTimer);
    (window as any).__prefFetchTimer = window.setTimeout(() => {
      setFetchTrigger(prev => prev + 1);
    }, 250);
  };

  // 初始化深色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 无需定时器清理

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* 动态背景 */}
      <div className={`fixed inset-0 animate-gradient -z-10 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50'
      }`}></div>
      <div className={`fixed inset-0 animate-pulse-color -z-10 ${
        isDarkMode
          ? 'bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20'
          : 'bg-gradient-to-tr from-pink-50/50 via-transparent to-cyan-50/50'
      }`}></div>
      
      <div className="relative container mx-auto px-4 py-6 max-w-7xl">
        {/* 头部组件 */}
        <Header isDark={isDarkMode} onThemeToggle={handleThemeToggle} />

        {/* 预设配置按钮 */}
        <PresetButtons 
          onPresetSelect={handlePresetSelect} 
          onRandomRecommend={() => setFetchTrigger(prev => prev + 1)}
        />

        {/* 食材搜索 */}
        <Suspense fallback={<div className="h-32 bg-gradient-to-br from-green-50/90 to-emerald-50/90 rounded-lg animate-pulse"></div>}>
          <IngredientSearch onSearch={() => setFetchTrigger(prev => prev + 1)} />
        </Suspense>

        {/* 主要内容区域 */}
        <div className="space-y-8 lg:space-y-12">
          {/* 控制面板和推荐区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* 雷达控制器 */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div className="h-96 bg-gradient-to-br from-white/90 to-blue-50/90 rounded-lg animate-pulse"></div>}>
                <RadarController
                  preferences={preferences}
                  onPreferencesChange={handlePreferencesChange}
                />
              </Suspense>
            </div>
            
            {/* 菜品推荐 */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="h-96 bg-gradient-to-br from-white/90 to-purple-50/90 rounded-lg animate-pulse"></div>}>
                <DishRecommendation 
                  preferences={preferences} 
                  fetchTrigger={fetchTrigger}
                />
              </Suspense>
            </div>
          </div>

          {/* 底部提示信息 */}
          <div className="text-center space-y-3 pt-8 border-t dark:border-gray-700 border-gradient-to-r from-transparent via-purple-200 to-transparent">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 dark:bg-gradient-to-r dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-700 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
                <span className="animate-pulse">💡</span>
                <span className="dark:text-blue-400 text-blue-700">实时智能推荐</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 dark:bg-gradient-to-r dark:from-emerald-900/20 dark:to-cyan-900/20 dark:border-emerald-700 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-200">
                <span className="animate-bounce">👆</span>
                <span className="dark:text-emerald-400 text-emerald-700">点击查看详细制作</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 dark:bg-gradient-to-r dark:from-orange-900/20 dark:to-pink-900/20 dark:border-orange-700 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-200">
                <span className="animate-pulse">🎯</span>
                <span className="dark:text-orange-400 text-orange-700">个性化口味匹配</span>
              </div>
            </div>
            
            <div className="text-xs dark:text-gray-400 text-muted-foreground">
              <p className="bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-purple-400 dark:to-blue-400 bg-gradient-to-r from-purple-600 to-blue-600">
                ✨ 基于AI算法的美食推荐引擎 · 让每一餐都恰到好处 ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}