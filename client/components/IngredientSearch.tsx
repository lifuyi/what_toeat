import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface IngredientSearchProps {
  onSearch: () => void;
}

const IngredientSearchComponent = ({ onSearch }: IngredientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    try {
      localStorage.setItem('ingredientSearch', searchTerm.trim());
      onSearch();
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, onSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    localStorage.removeItem('ingredientSearch');
    onSearch();
  }, [onSearch]);

  return (
    <Card className="mb-6 backdrop-blur-sm border-2 shadow-lg transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-slate-800/90 dark:border-gray-600 bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-emerald-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-center bg-clip-text text-transparent flex items-center justify-center gap-2 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400 bg-gradient-to-r from-emerald-600 to-green-600">
            <span className="text-xl animate-bounce">🥬</span>
            食材搜索
          </h3>
          
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="输入您有的食材，如：番茄、鸡蛋、土豆..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                className="
                  pr-10 border-2 rounded-full backdrop-blur-sm transition-all duration-300 focus:shadow-lg
                  dark:border-gray-600 dark:focus:border-emerald-500 dark:bg-gray-800/90 dark:placeholder:text-emerald-500 dark:text-emerald-300 dark:focus:shadow-emerald-500/20
                  border-emerald-200 focus:border-emerald-400 bg-white/90 placeholder:text-emerald-400 text-emerald-800 focus:shadow-emerald-200/50
                "
                disabled={isSearching}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="
                    absolute right-3 top-1/2 transform -translate-y-1/2
                    text-emerald-400 hover:text-emerald-600 transition-colors
                    w-5 h-5 flex items-center justify-center rounded-full
                    hover:bg-emerald-100
                  "
                >
                  ✕
                </button>
              )}
            </div>
            
            <Button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="
                bg-gradient-to-r from-emerald-500 to-green-500 
                hover:from-emerald-600 hover:to-green-600
                text-white border-0 rounded-full px-6 py-2
                transition-all duration-300 hover:scale-105 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  搜索中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🔍</span>
                  搜索菜品
                </div>
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs opacity-80 dark:text-emerald-400 text-emerald-600">
              💡 输入您现有的食材，我们为您推荐相关菜品
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 使用 React.memo 优化性能
export const IngredientSearch = React.memo(IngredientSearchComponent);