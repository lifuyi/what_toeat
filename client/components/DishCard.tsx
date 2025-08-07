import * as React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dish } from './DishRecommendation';

interface DishCardProps {
  dish: Dish & { matchScore?: number };
  onClick?: () => void;
  index: number;
}

const cardGradients = [
  'from-blue-500/10 to-purple-500/10',
  'from-emerald-500/10 to-cyan-500/10',
  'from-orange-500/10 to-red-500/10',
  'from-pink-500/10 to-rose-500/10',
  'from-indigo-500/10 to-blue-500/10',
  'from-lime-500/10 to-green-500/10',
];

const borderGradients = [
  'from-blue-500 to-purple-500',
  'from-emerald-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-lime-500 to-green-500',
];

export const DishCard = React.forwardRef<HTMLDivElement, DishCardProps>(
  ({ dish, onClick, index }, ref) => {
    const gradientIndex = index % cardGradients.length;
    
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };
    
    return (
      <Card 
        ref={ref}
        className={`
          cursor-pointer group relative overflow-hidden
          hover:shadow-2xl hover:shadow-current/20 
          transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          bg-gradient-to-br ${cardGradients[gradientIndex]}
          border-2 border-transparent bg-clip-padding
        `}
        onClick={handleClick}
      >
      {/* 渐变边框效果 */}
      <div className={`absolute inset-0 bg-gradient-to-r ${borderGradients[gradientIndex]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} 
           style={{ padding: '2px' }}>
        <div className="bg-card rounded-md h-full w-full"></div>
      </div>
      
      <CardContent className="relative p-4 z-10">
        <div className="space-y-3">
          {/* 匹配度指示器 */}
          {dish.matchScore !== undefined && (
            <div className="flex justify-between items-center">
              <div className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${borderGradients[gradientIndex]} text-white`}>
                匹配度 {Math.round(dish.matchScore)}%
              </div>
              <div className="animate-pulse">⭐</div>
            </div>
          )}
          
          {/* 菜品名称和描述 */}
          <div>
            <h3 className="line-clamp-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
              {dish.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {dish.description}
            </p>
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            {dish.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className={`
                  text-xs transition-all duration-300 hover:scale-110
                  bg-gradient-to-r ${borderGradients[(gradientIndex + tagIndex) % borderGradients.length]} 
                  text-white border-0
                `}
              >
                {tag}
              </Badge>
            ))}
            {dish.tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-300">
                +{dish.tags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* 时间和难度 */}
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="animate-pulse">⏱️</span>
              <span>{dish.cookingTime}</span>
            </span>
            <span className="flex items-center gap-1 text-orange-600">
              <span className="animate-pulse">🔥</span>
              <span>{dish.difficulty}</span>
            </span>
          </div>
        </div>
      </CardContent>
      
      {/* 悬浮效果装饰 */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping"></div>
      </div>
    </Card>
    );
  }
);

DishCard.displayName = "DishCard";