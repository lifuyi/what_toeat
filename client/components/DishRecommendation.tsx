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
      <Card className="w-full h-fit backdrop-blur-sm border-2 shadow-xl transition-all duration-300 dark:bg-gradient-to-br dark:from-gray-800/90 dark:to-slate-800/90 dark:border-gray-600 bg-gradient-to-br from-white/90 to-purple-50/90 border-purple-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-center sm:text-left bg-clip-text text-transparent flex items-center gap-2 dark:bg-gradient-to-r dark:from-orange-400 dark:to-red-400 bg-gradient-to-r from-orange-600 to-red-600">
            {currentSearchTerm ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🔍</span>
                  食材搜索结果
                  <span className="text-sm bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400 bg-gradient-to-r from-emerald-600 to-green-600">
                    "{currentSearchTerm}"
                  </span>
                </div>
                {searchInfo && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="dark:text-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      模式: {searchInfo.mode.toUpperCase()}
                    </span>
                    <span className="dark:text-purple-400 text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                      结果: {searchInfo.total}条
                    </span>
                    {searchInfo.searchTime && (
                      <span className="dark:text-orange-400 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                        耗时: {searchInfo.searchTime}
                      </span>
                    )}
                    <span className="dark:text-green-400 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      配料: {searchInfo.ingredients.join(', ')}
                    </span>
                  </div>
                )}
              </div>
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