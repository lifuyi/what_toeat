import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DishCard } from './DishCard';
import { DishDetailDialog } from './DishDetailDialog';
import { Preferences } from './RadarController';
import { getRecommendedRecipes, searchRecipes, searchRecipesByIngredients, convertRecipeToDish } from '../services/api';

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: string;
  difficulty: string;
  tags: string[];
  category: string;
  scores: {
    healthy: number;
    difficulty: number;
    vegetarian: number;
    spicy: number;
    sweetness: number;
  };
}

// 导入mock数据
import { mockDishes } from '../data/mockDishes';

// Removed large unused fallback array to avoid TS unused variable errors

interface DishRecommendationProps {
  preferences: Preferences;
  fetchTrigger: number; // Add fetchTrigger prop
}

const DishRecommendationComponent = ({
  preferences,
  fetchTrigger
}: DishRecommendationProps) => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dishes, setDishes] = useState<(Dish & { matchScore: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<{
    query: string;
    ingredients: string[];
    mode: string;
    total: number;
    searchTime?: string;
  } | null>(null);

  // 计算菜品匹配度 - 使用 useMemo 缓存计算函数
  const calculateMatchScore = useMemo(() => (dish: Dish): number => {
    const weights = {
      healthy: 1,
      difficulty: 1,
      vegetarian: 1,
      spicy: 1,
      sweetness: 1
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

    return Math.round((score / 50) * 100);
  }, [preferences]);

  // 根据偏好加入受控随机性，提升多样性
  const diversifyDishes = useCallback(
    (input: (Dish & { matchScore: number })[], options?: { alpha?: number; limit?: number }) => {
      const alpha = options?.alpha ?? 0.35; // 0=完全按分数，1=完全随机
      const limit = options?.limit ?? 12;
      // 为每道菜添加抖动分数，再排序
      const withJitter = input.map(dish => {
        const noise = Math.random() * 100; // 0-100 噪声
        const blended = dish.matchScore * (1 - alpha) + noise * alpha;
        return { dish, blended };
      });
      withJitter.sort((a, b) => b.blended - a.blended);
      // 轻度洗牌以避免稳定排序带来的相似度
      for (let i = withJitter.length - 1; i > 0; i--) {
        if (Math.random() < 0.15) {
          const j = Math.floor(Math.random() * (i + 1));
          [withJitter[i], withJitter[j]] = [withJitter[j], withJitter[i]];
        }
      }
      return withJitter.slice(0, limit).map(x => x.dish);
    },
    []
  );

  // 获取推荐菜品 - 使用 useCallback 优化
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRecommendedDishes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // cancel previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      // 检查是否有食材搜索
      const ingredientSearch = localStorage.getItem('ingredientSearch');
      setCurrentSearchTerm(ingredientSearch);
      
      let convertedDishes;
      if (ingredientSearch) {
        // 使用新的专门食材搜索API
        const ingredients = ingredientSearch.split(/\s+/).filter(term => term.trim());
        const searchMode = ingredients.length === 1 ? 'or' : 'and'; // 智能选择模式
        
        try {
          const searchResult = await searchRecipesByIngredients(ingredientSearch, searchMode, controller.signal);
          setSearchInfo(searchResult);
          
          // 转换为前端格式，保留匹配信息
          convertedDishes = searchResult.results.map(recipe => {
            const dish = convertRecipeToDish(recipe);
            return {
              ...dish,
              matchScore: (recipe as any).matchScore || 100,
              matchPercentage: (recipe as any).matchPercentage,
              matchedIngredients: (recipe as any).matchedIngredients
            };
          });
        } catch (error) {
          console.warn('专门食材搜索API失败，回退到通用搜索:', error);
          // 回退到改进的通用搜索API
          const recipes = await searchRecipes(ingredientSearch, searchMode, controller.signal);
          setSearchInfo({
            query: ingredientSearch,
            ingredients: ingredients,
            mode: searchMode,
            total: recipes.length
          });
          
          convertedDishes = recipes.map(recipe => {
            const dish = convertRecipeToDish(recipe);
            return {
              ...dish,
              matchScore: 100
            };
          });
        }
      } else {
        // 使用推荐API
        setSearchInfo(null);
        const recipes = await getRecommendedRecipes(preferences, controller.signal);
        convertedDishes = recipes
          .map(recipe => convertRecipeToDish(recipe))
          .map(dish => ({
            ...dish,
            matchScore: calculateMatchScore(dish)
          }))
          .slice(0, 36); // 先扩大候选池，便于多样化抽样
      }

      // 如果API结果为空且是食材搜索，回退到mock数据
      if (ingredientSearch && convertedDishes.length === 0) {
        const mockResults = performSmartDishSearch(mockDishes.map(dish => ({...dish, matchScore: 100})), ingredientSearch);
        setDishes(diversifyDishes(mockResults, { alpha: 0.2, limit: 12 }));
        setSearchInfo(prev => prev ? { ...prev, total: mockResults.length } : null);
      } else {
        setDishes(diversifyDishes(convertedDishes, { alpha: ingredientSearch ? 0.2 : 0.4, limit: 12 }));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('获取推荐菜品失败，请稍后重试');
      
      // 检查是否有食材搜索
      const ingredientSearch = localStorage.getItem('ingredientSearch');
      let fallbackDishes;
      
      if (ingredientSearch) {
        // 在mock数据中搜索包含该食材的菜品 - 使用智能搜索
        fallbackDishes = performSmartDishSearch(mockDishes.map(dish => ({...dish, matchScore: 100})), ingredientSearch);
      } else {
        // Fallback to mock data if API fails
        fallbackDishes = mockDishes
          .map(dish => ({
            ...dish,
            matchScore: calculateMatchScore(dish)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 36);
      }
      
      // 失败时也进行多样化处理
      setDishes(diversifyDishes(fallbackDishes, { alpha: ingredientSearch ? 0.2 : 0.4, limit: 12 }));
    } finally {
      setLoading(false);
    }
  }, [calculateMatchScore]);

  // Fetch recommendations when fetchTrigger changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRecommendedDishes();
    }, 250);
    return () => {
      clearTimeout(timeout);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTrigger, fetchRecommendedDishes]);

  

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
      <Card className="w-full h-fit backdrop-blur-xl border-2 shadow-2xl transition-all duration-500 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-slate-800/95 dark:border-gray-600 bg-gradient-to-br from-white/95 to-purple-50/95 border-purple-300">
        <CardHeader className="pb-5">
          <CardTitle className="text-center sm:text-left bg-clip-text text-transparent flex items-center gap-3 dark:bg-gradient-to-r dark:from-orange-400 dark:to-red-400 bg-gradient-to-r from-orange-600 to-red-600">
            {currentSearchTerm ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl animate-bounce">🔍</span>
                    <span className="text-2xl font-bold">食材搜索结果</span>
                  </div>
                  <span className="text-lg bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400 bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-1 rounded-full bg-white/30 dark:bg-black/20">
                    "{currentSearchTerm}"
                  </span>
                </div>
                {searchInfo && (
                  <div className="flex flex-wrap gap-2.5">
                    <span className="dark:text-blue-300 text-blue-700 bg-blue-100 dark:bg-blue-900/40 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>模式: {searchInfo.mode.toUpperCase()}</span>
                    </span>
                    <span className="dark:text-purple-300 text-purple-700 bg-purple-100 dark:bg-purple-900/40 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <span>📊</span>
                      <span>结果: {searchInfo.total}条</span>
                    </span>
                    {searchInfo.searchTime && (
                      <span className="dark:text-orange-300 text-orange-700 bg-orange-100 dark:bg-orange-900/40 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                        <span>⏱️</span>
                        <span>耗时: {searchInfo.searchTime}</span>
                      </span>
                    )}
                    <span className="dark:text-green-300 text-green-700 bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <span>🥗</span>
                      <span>配料: {searchInfo.ingredients.join(', ')}</span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-bounce">🎯</span>
                <span className="text-2xl font-bold">专属推荐菜品</span>
                <div className="ml-2 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping mr-1"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping mr-1 delay-100"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping delay-200"></div>
                </div>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">🍽️</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-medium dark:text-gray-200 text-gray-700">正在为您推荐美味菜品...</p>
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl animate-bounce">😅</div>
                <div className="space-y-4">
                  <p className="text-xl text-red-600 dark:text-red-400 font-medium">{error}</p>
                  <button 
                    onClick={fetchRecommendedDishes}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                  >
                    重试
                  </button>
                </div>
              </div>
            </div>
          ) : recommendedDishes.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-6 max-w-md">
                <div className="text-6xl">🍽️</div>
                <div className="space-y-3">
                  <p className="text-xl font-medium dark:text-gray-200 text-gray-700">暂无匹配菜品</p>
                  <p className="text-gray-500 dark:text-gray-400">尝试调整您的搜索条件或偏好设置</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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

// 智能搜索函数：同时支持AND搜索和整体词组搜索
function performSmartDishSearch(dishes: (Dish & { matchScore: number })[], query: string): (Dish & { matchScore: number })[] {
  const searchTerms = query.split(/\s+/).filter(term => term.trim());
  
  
  // 如果是多个词，同时进行AND搜索和整体搜索，然后合并去重
  if (searchTerms.length > 1) {
    // AND搜索：每个关键词都必须匹配
    const andResults = dishes.filter(dish => {
      const matchResult = searchTerms.every(term => {
        const lowerTerm = term.toLowerCase();
        const ingredientMatch = dish.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(lowerTerm)
        );
        const nameMatch = dish.name.toLowerCase().includes(lowerTerm);
        const descMatch = dish.description.toLowerCase().includes(lowerTerm);
        const tagMatch = dish.tags.some(tag => 
          tag.toLowerCase().includes(lowerTerm)
        );
        const synonymMatch = dish.ingredients.some(ingredient => {
          const lowerIngredient = ingredient.toLowerCase();
          return (
            (lowerTerm === '蛋' && lowerIngredient.includes('鸡蛋')) ||
            (lowerTerm === '鸡蛋' && lowerIngredient.includes('蛋')) ||
            (lowerTerm === '豆腐' && lowerIngredient.includes('豆腐'))
          );
        });
        const nameSynonymMatch = (lowerTerm === '蛋' && dish.name.toLowerCase().includes('鸡蛋')) ||
                                (lowerTerm === '鸡蛋' && dish.name.toLowerCase().includes('蛋'));
        
        const termMatches = ingredientMatch || nameMatch || descMatch || tagMatch || synonymMatch || nameSynonymMatch;
        
        
        return termMatches;
      });
      
      return matchResult;
    });
    
    // 整体搜索：匹配完整查询词组（去掉空格）
    const phraseQuery = searchTerms.join('');
    const phraseResults = dishes.filter(dish => {
      return (
        dish.name.toLowerCase().includes(phraseQuery) ||
        dish.description.toLowerCase().includes(phraseQuery) ||
        dish.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(phraseQuery)
        ) ||
        dish.tags.some(tag => 
          tag.toLowerCase().includes(phraseQuery)
        )
      );
    });
    
    // 合并结果并去重，优先显示整体匹配的结果
    const combinedResults = [...phraseResults];
    andResults.forEach(dish => {
      if (!combinedResults.find(r => r.id === dish.id)) {
        combinedResults.push(dish);
      }
    });
    
    // 如果AND搜索和整体搜索都没有结果，降级为OR搜索
    if (combinedResults.length === 0) {
      const orResults = dishes.filter(dish => {
        return searchTerms.some(term => {
          const lowerTerm = term.toLowerCase();
          const ingredientMatch = dish.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(lowerTerm)
          );
          const nameMatch = dish.name.toLowerCase().includes(lowerTerm);
          const descMatch = dish.description.toLowerCase().includes(lowerTerm);
          const tagMatch = dish.tags.some(tag => 
            tag.toLowerCase().includes(lowerTerm)
          );
          const synonymMatch = dish.ingredients.some(ingredient => {
            const lowerIngredient = ingredient.toLowerCase();
            return (
              (lowerTerm === '蛋' && lowerIngredient.includes('鸡蛋')) ||
              (lowerTerm === '鸡蛋' && lowerIngredient.includes('蛋')) ||
              (lowerTerm === '豆腐' && lowerIngredient.includes('豆腐'))
            );
          });
          const nameSynonymMatch = (lowerTerm === '蛋' && dish.name.toLowerCase().includes('鸡蛋')) ||
                                  (lowerTerm === '鸡蛋' && dish.name.toLowerCase().includes('蛋'));
          
          return ingredientMatch || nameMatch || descMatch || tagMatch || synonymMatch || nameSynonymMatch;
        });
      });
      
      combinedResults.push(...orResults);
    }
    
    return combinedResults.slice(0, 36);
  } else {
    // 单个词的搜索
    const term = searchTerms[0];
    const lowerTerm = term.toLowerCase();
    
    return dishes.filter(dish => {
      return (
        dish.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(lowerTerm)
        ) ||
        dish.name.toLowerCase().includes(lowerTerm) ||
        dish.description.toLowerCase().includes(lowerTerm) ||
        dish.tags.some(tag => 
          tag.toLowerCase().includes(lowerTerm)
        ) ||
        // 支持特定的同义词匹配
        dish.ingredients.some(ingredient => {
          const lowerIngredient = ingredient.toLowerCase();
          return (
            (lowerTerm === '蛋' && lowerIngredient.includes('鸡蛋')) ||
            (lowerTerm === '鸡蛋' && lowerIngredient.includes('蛋')) ||
            (lowerTerm === '豆腐' && lowerIngredient.includes('豆腐'))
          );
        }) ||
        (lowerTerm === '蛋' && dish.name.toLowerCase().includes('鸡蛋')) ||
        (lowerTerm === '鸡蛋' && dish.name.toLowerCase().includes('蛋'))
      );
    }).slice(0, 36);
  }
}

// 使用 React.memo 优化性能
export const DishRecommendation = React.memo(DishRecommendationComponent);