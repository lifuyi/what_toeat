import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { DateInfo } from './DateInfo';

interface HeaderProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Header({ isDark = false, onThemeToggle }: HeaderProps) {
  // 根据时间动态生成标题
  const getTimeBasedTitle = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 10) {
      return { greeting: '早上好', meal: '早餐' };
    } else if (hour >= 10 && hour < 16) {
      return { greeting: '中午好', meal: '午餐' };
    } else {
      return { greeting: '晚上好', meal: '晚餐' };
    }
  };
  
  const { greeting, meal } = getTimeBasedTitle();

  return (
    <div className="text-center mb-8 sm:mb-12 relative">
      {/* 背景装饰 */}
      <div className={`absolute inset-0 rounded-3xl blur-3xl -z-10 animate-pulse-color ${
        isDark 
          ? 'bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-emerald-900/20'
          : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10'
      }`}></div>
      
      <div className="relative">
        {/* 主标题 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="animate-float">
            <Sparkles className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
          </div>
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl bg-clip-text text-transparent animate-gradient ${
            isDark
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
          }`}>
            {greeting}，{meal}吃什么？
          </h1>
          <div className="animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-3xl">🍽️</span>
          </div>
        </div>
        
        {/* 副标题 */}
        <p className={`text-sm sm:text-lg max-w-2xl mx-auto mb-2 ${
          isDark ? 'text-gray-300' : 'text-muted-foreground'
        }`}>
          <span className={`bg-clip-text text-transparent ${
            isDark
              ? 'bg-gradient-to-r from-orange-400 to-pink-400'
              : 'bg-gradient-to-r from-orange-500 to-pink-500'
          }`}>
            调整你的口味偏好，获取个性化菜品推荐
          </span>
        </p>
        
        {/* 日期信息 */}
        <div className="mb-6">
          <DateInfo />
        </div>
        
        {/* 装饰性标签 */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs rounded-full animate-pulse-color">
            🤖 AI智能推荐
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-lime-500 text-white text-xs rounded-full animate-pulse-color" style={{ animationDelay: '0.5s' }}>
            ⚡ 实时更新
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full animate-pulse-color" style={{ animationDelay: '1s' }}>
            🎯 个性化定制
          </span>
        </div>

        {/* 主题切换按钮 */}
        {onThemeToggle && (
          <div className="absolute top-0 right-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onThemeToggle}
              className={`backdrop-blur-sm border-2 transition-all duration-300 hover:scale-110 ${
                isDark
                  ? 'bg-gray-800/80 border-gray-600 hover:border-gray-500 text-gray-200'
                  : 'bg-white/80 border-purple-200 hover:border-purple-400 text-gray-700'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}