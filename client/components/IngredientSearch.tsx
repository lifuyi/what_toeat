import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface IngredientSearchProps {
  onSearch: () => void;
}

export function IngredientSearch({ onSearch }: IngredientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsSearching(true);
    
    try {
      // 这里可以调用API搜索相关菜品
      // 暂时使用localStorage存储搜索词，供DishRecommendation组件使用
      localStorage.setItem('ingredientSearch', searchTerm.trim());
      onSearch();
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    localStorage.removeItem('ingredientSearch');
    onSearch();
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm border-2 border-emerald-200 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <span className="text-xl animate-bounce">🥬</span>
            食材搜索
          </h3>
          
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="输入您有的食材，如：番茄、鸡蛋、土豆..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="
                  pr-10 border-2 border-emerald-200 focus:border-emerald-400 
                  bg-white/90 backdrop-blur-sm rounded-full
                  placeholder:text-emerald-400 text-emerald-800
                  transition-all duration-300 focus:shadow-lg focus:shadow-emerald-200/50
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
            <p className="text-xs text-emerald-600 opacity-80">
              💡 输入您现有的食材，我们为您推荐相关菜品
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}