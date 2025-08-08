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
  'from-violet-500/10 to-fuchsia-500/10',
  'from-amber-500/10 to-yellow-500/10',
  'from-teal-500/10 to-emerald-500/10',
  'from-sky-500/10 to-indigo-500/10',
  'from-rose-500/10 to-pink-500/10',
];

const borderGradients = [
  'from-blue-500 to-purple-500',
  'from-emerald-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
  'from-lime-500 to-green-500',
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-yellow-500',
  'from-teal-500 to-emerald-500',
  'from-sky-500 to-indigo-500',
  'from-rose-500 to-pink-500',
];

const DishCardComponent = React.forwardRef<HTMLDivElement, DishCardProps>(
  ({ dish, onClick, index }, ref) => {
    const gradientIndex = index % cardGradients.length;
    
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    // Difficulty calculation function (same as in DishDetailDialog)
    const getDifficultyString = (score: number): string => {
      if (score <= 1) return '简单';
      if (score === 2) return '中等';
      if (score === 3) return '困难';
      return '未知'; // Fallback for unexpected scores
    };

    // Create difficulty badge and combine with filtered tags
    const difficultyKeywords = ['简单', '中等', '困难', '容易', '难'];
    const filteredTags = dish.tags.filter(tag => !difficultyKeywords.includes(tag));
    
    const difficultyLevel = getDifficultyString(dish.scores.difficulty);
    
    // Create difficulty badge object with custom colors
    const getDifficultyColor = (level: string): string => {
      switch (level) {
        case '简单': return 'from-green-500 to-green-600';
        case '中等': return 'from-blue-500 to-blue-600';
        case '困难': return 'from-red-500 to-red-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const difficultyBadge = {
      text: difficultyLevel,
      originalText: difficultyLevel,
      isDifficulty: true,
      isSpecial: false,
      color: getDifficultyColor(difficultyLevel)
    };
    
    // Create tag objects with special colors for certain tags
    const getTagColor = (tagText: string): string => {
      if (tagText === '素食') {
        return 'from-emerald-300 to-emerald-400 text-emerald-900';
      }
      if (tagText === '辣') {
        return 'from-pink-500 to-rose-500';
      }
      return '';
    };

    // Add emoji to special tags
    const getTagDisplay = (tagText: string): string => {
      if (tagText === '辣') {
        return '🌶️ 辣';
      }
      return tagText;
    };

    // Combine difficulty badge with other tags
    const allTags = [
      difficultyBadge, 
      ...filteredTags.map(tag => ({ 
        text: getTagDisplay(tag),
        originalText: tag,
        isDifficulty: false, 
        isSpecial: tag === '素食' || tag === '辣',
        color: getTagColor(tag)
      }))
    ];
    
    return (
      <Card 
        ref={ref}
        className={`
          cursor-pointer group relative overflow-hidden
          hover:shadow-2xl hover:shadow-current/20 
          transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          bg-gradient-to-br ${cardGradients[gradientIndex]}
          border-2 border-transparent bg-clip-padding
          dark:hover:shadow-gray-900/40
        `}
        onClick={handleClick}
      >
      {/* 渐变边框效果 */}
      <div className={`absolute inset-0 bg-gradient-to-r ${borderGradients[gradientIndex]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} 
           style={{ padding: '2px' }}>
        <div className="rounded-md h-full w-full dark:bg-gray-800 bg-card"></div>
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
            <h3 className="line-clamp-1 bg-clip-text text-transparent transition-all duration-300 dark:bg-gradient-to-r dark:from-gray-200 dark:to-gray-400 dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 bg-gradient-to-r from-gray-800 to-gray-600 group-hover:from-purple-600 group-hover:to-blue-600">
              {dish.name}
            </h3>
            <p className="text-sm line-clamp-2 mt-1 dark:text-gray-400 text-muted-foreground whitespace-pre-line">
              {dish.description}
            </p>
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 3).map((tag, tagIndex) => (
              <Badge 
                key={tag.text} 
                variant="secondary"
                className={`
                  text-xs transition-all duration-300 hover:scale-110
                  bg-gradient-to-r ${
                    tag.isDifficulty || tag.isSpecial 
                      ? tag.color 
                      : borderGradients[(gradientIndex + tagIndex) % borderGradients.length]
                  } 
                  text-white border-0
                `}
              >
                {tag.text}
              </Badge>
            ))}
            {allTags.length > 3 && (
              <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400 border-gray-300">
                +{allTags.length - 3}
              </Badge>
            )}
          </div>
          
          {/* 制作时间 */}
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="animate-pulse">⏱️</span>
              <span>{dish.cookingTime}</span>
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

DishCardComponent.displayName = "DishCard";

// 使用 React.memo 优化性能
export const DishCard = React.memo(DishCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.dish.id === nextProps.dish.id &&
    prevProps.dish.matchScore === nextProps.dish.matchScore &&
    prevProps.index === nextProps.index
  );
});