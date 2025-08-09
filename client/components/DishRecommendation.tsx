import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DishCard } from './DishCard';
import { DishDetailDialog } from './DishDetailDialog';
import { Preferences } from './RadarController';
import { getRecommendedRecipes, searchRecipes, convertRecipeToDish } from '../services/api';

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: string;
  difficulty: string;
  tags: string[];
  category?: string;
  scores: {
    healthy: number;
    simple: number;
    difficulty: number;
    quick: number;
    vegetarian: number;
    spicy: number;
  };
}

// 导入mock数据
import { mockDishes } from '../data/mockDishes';

// Removed large unused fallback array to avoid TS unused variable errors

interface DishRecommendationProps {
  preferences: Preferences;
  onPreferencesChange?: (preferences: Preferences) => void;
  shouldUpdateRadar?: boolean;
  onRadarUpdated?: () => void;
  fetchTrigger: number; // Add fetchTrigger prop
}

const DishRecommendationComponent = ({
  preferences,
  onPreferencesChange,
  shouldUpdateRadar = false,
  onRadarUpdated,
  fetchTrigger
}: DishRecommendationProps) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dishes, setDishes] = useState<(Dish & { matchScore: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string | null>(null);

  // 计算菜品匹配度 - 使用 useMemo 缓存计算函数
  const calculateMatchScore = useMemo(() => (dish: Dish): number => {
    const weights = {
      healthy: 1,
      simple: 1,
      difficulty: -1,
      quick: 1,
      vegetarian: 1,
      spicy: 1
    };

    let score = 0;
    Object.entries(preferences).forEach(([key, value]) => {
      const dishScore = dish.scores[key as keyof typeof dish.scores];
      const weight = weights[key as keyof typeof weights];
      
      if (key === 'difficulty') {
        score += Math.max(0, 10 - Math.abs(dishScore - value)) * weight;
      } else {
        score += Math.max(0, 10 - Math.abs(dishScore - value)) * weight;
      }
    });

    return Math.round((score / 60) * 100);
  }, [preferences]);

  // 获取推荐菜品 - 使用 useCallback 优化
  const fetchRecommendedDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 检查是否有食材搜索
      const ingredientSearch = localStorage.getItem('ingredientSearch');
      setCurrentSearchTerm(ingredientSearch);
      let recipes;
      
      if (ingredientSearch) {
        // 使用食材搜索API
        recipes = await searchRecipes(ingredientSearch);
      } else {
        // 使用偏好推荐API
        recipes = await getRecommendedRecipes(preferences);
      }
      
      const convertedDishes = recipes
        .map(recipe => convertRecipeToDish(recipe))
        .map(dish => ({
          ...dish,
          matchScore: ingredientSearch ? 100 : calculateMatchScore(dish) // 食材搜索结果给满分
        }))
        .slice(0, 12);
      
      // 过滤API搜索结果，只保留真正匹配的菜品
      let filteredApiResults = convertedDishes;
      if (ingredientSearch && convertedDishes.length > 0) {
        const searchTerms = ingredientSearch.split(/\s+/).filter(term => term.trim());
        
        filteredApiResults = convertedDishes.filter(dish => {
          return searchTerms.every(term => {
            const lowerTerm = term.toLowerCase();
            const ingredientMatch = dish.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(lowerTerm)
            );
            const nameMatch = dish.name.toLowerCase().includes(lowerTerm);
            const descMatch = dish.description.toLowerCase().includes(lowerTerm);
            const tagMatch = dish.tags && dish.tags.some(tag => 
              tag.toLowerCase().includes(lowerTerm)
            );
            
            return ingredientMatch || nameMatch || descMatch || tagMatch;
          });
        });
      }
      
      // 如果API搜索结果为空或过滤后无匹配，使用mock数据
      if (ingredientSearch && filteredApiResults.length === 0) {
        const searchTerms = ingredientSearch.split(/\s+/).filter(term => term.trim());
        
        const mockResults = mockDishes
          .filter(dish => {
            return searchTerms.every(term => {
              const lowerTerm = term.toLowerCase();
              return (
                dish.ingredients.some(ingredient => 
                  ingredient.toLowerCase().includes(lowerTerm)
                ) ||
                dish.name.toLowerCase().includes(lowerTerm) ||
                dish.description.toLowerCase().includes(lowerTerm) ||
                dish.tags.some(tag => 
                  tag.toLowerCase().includes(lowerTerm)
                )
              );
            });
          })
          .map(dish => ({
            ...dish,
            matchScore: 100
          }))
          .slice(0, 12);
          
        setDishes(mockResults);
      } else {
        setDishes(filteredApiResults);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('获取推荐菜品失败，请稍后重试');
      
      // 检查是否有食材搜索
      const ingredientSearch = localStorage.getItem('ingredientSearch');
      let fallbackDishes;
      
      if (ingredientSearch) {
        // 在mock数据中搜索包含该食材的菜品 - 支持多关键词搜索
        const searchTerms = ingredientSearch.split(/\s+/).filter(term => term.trim());
        fallbackDishes = mockDishes
          .filter(dish => {
            // 智能搜索：每个关键词都必须在菜品信息中找到匹配 (AND关系)
            return searchTerms.every(term => {
              const lowerTerm = term.toLowerCase();
              return (
                dish.ingredients.some(ingredient => 
                  ingredient.toLowerCase().includes(lowerTerm)
                ) ||
                dish.name.toLowerCase().includes(lowerTerm) ||
                dish.description.toLowerCase().includes(lowerTerm) ||
                dish.tags.some(tag => 
                  tag.toLowerCase().includes(lowerTerm)
                ) ||
                // 支持部分匹配和同义词
                dish.ingredients.some(ingredient => {
                  const lowerIngredient = ingredient.toLowerCase();
                  return (
                    (lowerTerm === '蛋' && lowerIngredient.includes('鸡蛋')) ||
                    (lowerTerm === '鸡蛋' && lowerIngredient.includes('蛋')) ||
                    (lowerTerm === '豆腐' && lowerIngredient.includes('豆腐')) ||
                    lowerIngredient.includes(lowerTerm.slice(0, -1)) // 部分匹配
                  );
                }) ||
                dish.name.toLowerCase().includes(lowerTerm.slice(0, -1))
              );
            });
          })
          .map(dish => ({
            ...dish,
            matchScore: 100
          }))
          .slice(0, 12);
      } else {
        // Fallback to mock data if API fails
        fallbackDishes = mockDishes
          .map(dish => ({
            ...dish,
            matchScore: calculateMatchScore(dish)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 12);
      }
      
      setDishes(fallbackDishes);
    } finally {
      setLoading(false);
    }
  }, [calculateMatchScore]);

  // Fetch recommendations when fetchTrigger changes
  useEffect(() => {
    fetchRecommendedDishes();
  }, [fetchTrigger]);

  // Update radar chart based on first recommended dish when shouldUpdateRadar is true
  useEffect(() => {
    if (dishes.length > 0 && onPreferencesChange && shouldUpdateRadar) {
      const firstDish = dishes[0];
      // Update preferences to reflect the characteristics of the best match
      const updatedPreferences = {
        healthy: firstDish.scores.healthy,
        simple: firstDish.scores.simple,
        difficulty: firstDish.scores.difficulty,
        quick: firstDish.scores.quick,
        vegetarian: firstDish.scores.vegetarian,
        spicy: firstDish.scores.spicy
      };
      onPreferencesChange(updatedPreferences);
      if (onRadarUpdated) {
        onRadarUpdated(); // Notify parent that radar has been updated
      }
    }
  }, [dishes, shouldUpdateRadar]);

  const recommendedDishes = dishes;

  const handleDishClick = useCallback((dish: Dish & { matchScore: number }) => {
    setSelectedDish(dish);
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedDish(null);
  }, []);

  return (
    <>
      <Card className="w-full h-fit backdrop-blur-sm border-2 shadow-xl transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-slate-800/90 dark:border-gray-600 bg-gradient-to-br from-white/90 to-purple-50/90 border-purple-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-center sm:text-left bg-clip-text text-transparent flex items-center gap-2 dark:bg-gradient-to-r dark:from-orange-400 dark:to-red-400 bg-gradient-to-r from-orange-600 to-red-600">
            {currentSearchTerm ? (
              <>
                <span className="text-2xl animate-bounce">🔍</span>
                食材搜索结果
                <span className="text-sm bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400 bg-gradient-to-r from-emerald-600 to-green-600">
                  "{currentSearchTerm}"
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl animate-bounce">🎯</span>
                专属推荐菜品
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-muted-foreground">正在为您推荐美味菜品...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-4xl">😅</div>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={fetchRecommendedDishes}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendedDishes.map((dish, index) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onClick={() => handleDishClick(dish)}
                  index={index}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DishDetailDialog
        dish={selectedDish}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
      />
    </>
  );
};

// 使用 React.memo 优化性能
export const DishRecommendation = React.memo(DishRecommendationComponent);