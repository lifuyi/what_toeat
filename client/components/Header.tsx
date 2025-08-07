import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Header({ isDark = false, onThemeToggle }: HeaderProps) {
  return (
    <div className="text-center mb-8 sm:mb-12 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-3xl blur-3xl -z-10 animate-pulse-color"></div>
      
      <div className="relative">
        {/* 主标题 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="animate-float">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
            今天吃什么？
          </h1>
          <div className="animate-float" style={{ animationDelay: '1s' }}>
            <span className="text-3xl">🍽️</span>
          </div>
        </div>
        
        {/* 副标题 */}
        <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-6">
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            调整你的口味偏好，获取个性化菜品推荐
          </span>
        </p>
        
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
              className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
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