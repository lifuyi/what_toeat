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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] sm:max-w-3xl bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm border-2 border-blue-200">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <span className="text-2xl animate-bounce">🍽️</span>
            {dish.name}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* 描述 */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-gray-700 text-sm sm:text-base">
                {dish.description}
              </p>
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag, index) => (
                <Badge 
                  key={tag} 
                  className={`
                    text-sm px-3 py-1 border-0 text-white
                    ${index % 2 === 0 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }
                  `}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg animate-pulse">⏱️</span>
                  <span className="text-sm text-emerald-700">制作时间</span>
                </div>
                <span className="text-lg bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                  {dish.cookingTime}
                </span>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg animate-pulse">🔥</span>
                  <span className="text-sm text-orange-700">难度等级</span>
                </div>
                <span className="text-lg bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
                  {dish.difficulty}
                </span>
              </div>
            </div>

            {/* 食材清单 */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-lg">
                <span className="text-2xl animate-bounce">🥘</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  所需食材
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dish.ingredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className={`
                      flex items-center gap-3 text-sm p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105
                      ${index % 3 === 0 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' 
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                        : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                      }
                    `}
                  >
                    <div className={`
                      w-3 h-3 rounded-full flex-shrink-0
                      ${index % 3 === 0 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : index % 3 === 1
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500'
                      }
                    `}></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 制作步骤 */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-lg">
                <span className="text-2xl animate-bounce">👨‍🍳</span>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  制作步骤
                </span>
              </h4>
              <div className="space-y-4">
                {dish.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm animate-pulse-color">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-gray-700 leading-relaxed">{step}</p>
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