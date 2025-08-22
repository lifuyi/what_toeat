import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Dish } from './DishRecommendation';

interface DishDetailDialogProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DishDetailDialog({ dish, isOpen, onClose }: DishDetailDialogProps) {
  if (!dish) return null;

  const getDifficultyString = (score: number): string => {
    if (score <= 1) return '简单';
    if (score === 2) return '中等';
    if (score === 3) return '困难';
    return '未知'; // Fallback for unexpected scores
  };

  // Get a visual icon based on dish name
  const getDishIcon = () => {
    if (dish.name.includes('面') || dish.name.includes('粉')) return '🍜';
    if (dish.name.includes('汤') || dish.name.includes('羹')) return '🍲';
    if (dish.name.includes('炒')) return '🥘';
    if (dish.name.includes('蒸')) return '🍚';
    if (dish.name.includes('饼')) return '🥞';
    return '🍽️';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] sm:max-w-4xl bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-lg border-2 border-blue-300 shadow-2xl">
        <DialogHeader className="pb-5">
          <DialogTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent flex items-center gap-4">
            <span className="text-3xl animate-bounce">{getDishIcon()}</span>
            <span className="font-bold">{dish.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-8">
            {/* Description with enhanced styling */}
            <div className="p-5 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl border border-blue-300 shadow-sm">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {dish.description}
              </p>
            </div>
            
            {/* Tags with enhanced styling */}
            <div className="flex flex-wrap gap-3">
              {dish.tags
                .filter(tag => !['简单', '中等', '困难', '容易', '难', 'tip'].includes(tag))
                .map((tag, index) => (
                  <Badge
                    key={tag}
                    className={`
                      text-base px-4 py-2 rounded-full border-0 text-white font-medium shadow-md
                      transition-all duration-300 hover:scale-105 hover:shadow-lg
                      ${
                        tag === '素食'
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-900'
                          : index % 2 === 0
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }
                    `}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>

            {/* Enhanced info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl border border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl animate-pulse">⏱️</span>
                  <span className="text-base font-semibold text-emerald-800">制作时间</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                  {dish.cookingTime}
                </span>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl border border-orange-300 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl animate-pulse">🔥</span>
                  <span className="text-base font-semibold text-orange-800">难度等级</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                  {getDifficultyString(dish.scores.difficulty)}
                </span>
              </div>
            </div>

            {/* Enhanced ingredients section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <span className="text-3xl animate-bounce">🥘</span>
                <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                  所需食材
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dish.ingredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className={`
                      flex items-center gap-4 text-base p-4 rounded-2xl border-2 transition-all duration-300
                      hover:scale-[1.02] hover:shadow-lg transform-gpu
                      ${index % 3 === 0 
                        ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 hover:shadow-blue-200' 
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 hover:shadow-purple-200'
                        : 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 hover:shadow-emerald-200'
                      }
                    `}
                  >
                    <div className={`
                      w-4 h-4 rounded-full flex-shrink-0
                      ${index % 3 === 0 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500'
                      }
                    `}></div>
                    <span className="text-gray-800 font-medium">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced steps section */}
            <div className="space-y-5">
              <h4 className="flex items-center gap-3 text-xl font-bold">
                <span className="text-3xl animate-bounce">👨‍🍳</span>
                <span className="bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                  制作步骤
                </span>
              </h4>
              <div className="space-y-5">
                {dish.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="flex gap-5 p-5 bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl border border-gray-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-base font-bold animate-pulse-color shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="pt-1.5 text-gray-800 leading-relaxed text-base">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}