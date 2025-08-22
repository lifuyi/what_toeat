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
  'from-blue-500/15 to-purple-500/15',
  'from-emerald-500/15 to-cyan-500/15',
  'from-orange-500/15 to-red-500/15',
  'from-pink-500/15 to-rose-500/15',
  'from-indigo-500/15 to-blue-500/15',
  'from-lime-500/15 to-green-500/15',
  'from-violet-500/15 to-fuchsia-500/15',
  'from-amber-500/15 to-yellow-500/15',
  'from-teal-500/15 to-emerald-500/15',
  'from-sky-500/15 to-indigo-500/15',
  'from-rose-500/15 to-pink-500/15',
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

const glowGradients = [
  'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
  'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
  'shadow-[0_0_15px_rgba(99,102,241,0.3)]',
  'shadow-[0_0_15px_rgba(132,204,22,0.3)]',
  'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  'shadow-[0_0_15px_rgba(20,184,166,0.3)]',
  'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
];

export const DishCard = React.memo(React.forwardRef<HTMLDivElement, DishCardProps>(
  ({ dish, onClick, index }, ref) => {
    const gradientIndex = index % cardGradients.length;
    
    const handleClick = () => {
      if (onClick) {
        onClick();
      }
    };

    const getDifficultyString = (score: number): string => {
      if (score <= 1) return '简单';
      if (score === 2) return '中等';
      if (score === 3) return '困难';
      return '未知';
    };

    const difficultyKeywords = ['简单', '中等', '困难', '容易', '难'];
    const filteredTags = dish.tags.filter(tag => !difficultyKeywords.includes(tag));
    
    const difficultyLevel = getDifficultyString(dish.scores.difficulty);
    
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
    
    const getTagColor = (tagText: string): string => {
      if (tagText === '素食') {
        return 'from-emerald-300 to-emerald-400 text-emerald-900';
      }
      if (tagText === '辣') {
        return 'from-pink-500 to-rose-500';
      }
      return '';
    };

    const getTagDisplay = (tagText: string): string => {
      if (tagText === '辣') {
        return '🌶️ 辣';
      }
      return tagText;
    };

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

    // Enhanced visual elements for better user experience
    const getVisualIcon = () => {
      if (dish.name.includes('面') || dish.name.includes('粉')) return '🍜';
      if (dish.name.includes('汤') || dish.name.includes('羹')) return '🍲';
      if (dish.name.includes('炒')) return '🥘';
      if (dish.name.includes('蒸')) return '🍚';
      if (dish.name.includes('饼')) return '🥞';
      return '🍽️';
    };

    return (
      <Card 
        ref={ref}
        className={`
          cursor-pointer group relative overflow-hidden
          hover:shadow-2xl transition-all duration-500
          bg-gradient-to-br ${cardGradients[gradientIndex]}
          border-2 border-transparent bg-clip-padding
          dark:hover:shadow-gray-900/50
          transform-gpu hover:-translate-y-1
          ${glowGradients[gradientIndex]}
        `}
        onClick={handleClick}
      >
        {/* Animated border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${borderGradients[gradientIndex]} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl`} 
             style={{ padding: '2px' }}>
          <div className="rounded-lg h-full w-full dark:bg-gray-800/80 bg-white/80 backdrop-blur-sm"></div>
        </div>
        
        <CardContent className="relative p-0 z-10">
          <div className="p-4 space-y-3">
            {/* Matching score badge with improved styling - moved to top of content */}
            {dish.matchScore !== undefined && (
              <div className={`
                absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold
                bg-gradient-to-r ${borderGradients[gradientIndex]} 
                text-white shadow-lg transform transition-all duration-300
                group-hover:scale-110 group-hover:rotate-3
                flex items-center gap-1 z-20
              `}>
                <span>🎯</span>
                <span>{Math.round(dish.matchScore)}%</span>
              </div>
            )}
            {/* Dish name with enhanced styling */}
            <div>
              <h3 className={`
                line-clamp-1 font-bold text-lg
                bg-clip-text text-transparent
                transition-all duration-500
                dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300 
                dark:group-hover:from-purple-400 dark:group-hover:to-blue-400 
                bg-gradient-to-r from-gray-800 to-gray-600 
                group-hover:from-purple-600 group-hover:to-blue-600
              `}>
                {dish.name}
              </h3>
              <p className="text-sm line-clamp-2 mt-1 dark:text-gray-300 text-gray-600 whitespace-pre-line leading-relaxed">
                {dish.description}
              </p>
            </div>
            
            {/* Enhanced tags section */}
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 3).map((tag, tagIndex) => (
                <Badge 
                  key={tag.text} 
                  variant="secondary"
                  className={`
                    text-xs font-medium px-2 py-1 transition-all duration-300
                    hover:scale-105 hover:shadow-md
                    bg-gradient-to-r ${
                      tag.isDifficulty || tag.isSpecial 
                        ? tag.color 
                        : borderGradients[(gradientIndex + tagIndex) % borderGradients.length]
                    } 
                    text-white border-0 shadow-sm
                  `}
                >
                  {tag.text}
                </Badge>
              ))}
              {allTags.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50">
                  +{allTags.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Enhanced info section */}
            <div className="flex justify-between items-center pt-2">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="text-base animate-pulse">⏱️</span>
                <span className="text-sm">{dish.cookingTime}</span>
              </span>
              <span className={`
                flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                text-white bg-gradient-to-r ${getDifficultyColor(difficultyLevel)}
                shadow-sm transform transition-all duration-300
                group-hover:scale-105
              `}>
                {difficultyLevel}
              </span>
            </div>
          </div>
        </CardContent>
        
        {/* Enhanced hover indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping"></div>
        </div>
      </Card>
    );
  })
);