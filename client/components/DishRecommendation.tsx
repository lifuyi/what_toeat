import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DishCard } from './DishCard';
import { DishDetailDialog } from './DishDetailDialog';
import { Preferences } from './RadarController';
import { getRecommendedRecipes, searchRecipes, convertRecipeToDish, type Recipe } from '../services/api';

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

// 备用数据（如果导入失败）
const fallbackMockDishes: Dish[] = [
  {
    id: '1',
    name: '番茄鸡蛋面',
    description: '简单快手的家常面条，营养丰富',
    ingredients: ['鸡蛋 2个', '番茄 2个', '面条 200g', '葱花 适量', '盐 适量', '糖 少许'],
    steps: [
      '鸡蛋打散炒熟盛起备用',
      '番茄切块下锅炒出汁水',
      '加入炒蛋和调料炒匀',
      '煮面条至八分熟',
      '面条加入番茄鸡蛋中拌匀即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['家常', '快手', '营养'],
    category: '快手菜',
    scores: { healthy: 8, simple: 9, difficulty: 2, quick: 9, vegetarian: 7, spicy: 1 }
  },
  {
    id: '2',
    name: '宫保鸡丁',
    description: '经典川菜，香辣下饭',
    ingredients: ['鸡胸肉 300g', '花生米 50g', '干辣椒 适量', '花椒 适量', '葱 1根', '姜蒜 适量'],
    steps: [
      '鸡肉切丁腌制15分钟',
      '热锅炸花生米盛起',
      '鸡丁下锅炒至变色',
      '加入调料和干辣椒炒香',
      '最后放入花生米炒匀即可'
    ],
    cookingTime: '25分钟',
    difficulty: '中等',
    tags: ['川菜', '辣', '下饭'],
    category: '川菜',
    scores: { healthy: 6, simple: 5, difficulty: 6, quick: 6, vegetarian: 2, spicy: 8 }
  },
  {
    id: '3',
    name: '清蒸鲈鱼',
    description: '清淡鲜美，营养健康',
    ingredients: ['鲈鱼 1条', '生姜 3片', '葱 2根', '料酒 适量', '生抽 2勺', '蒸鱼豉油 2勺'],
    steps: [
      '鲈鱼处理干净，鱼身划几刀',
      '放入姜片和料酒腌制10分钟',
      '上蒸锅蒸8-10分钟',
      '取出倒掉水分，放上葱丝',
      '淋上蒸鱼豉油，浇热油即可'
    ],
    cookingTime: '20分钟',
    difficulty: '简单',
    tags: ['清淡', '健康', '蒸菜'],
    category: '健康菜品',
    scores: { healthy: 9, simple: 7, difficulty: 3, quick: 7, vegetarian: 1, spicy: 0 }
  },
  {
    id: '4',
    name: '麻婆豆腐',
    description: '川菜经典，麻辣鲜香',
    ingredients: ['豆腐 400g', '肉末 100g', '豆瓣酱 2勺', '花椒粉 适量', '葱花 适量', '蒜末 适量'],
    steps: [
      '豆腐切块用盐水焯一下',
      '肉末炒香，加入豆瓣酱炒出红油',
      '加入高汤煮开',
      '放入豆腐块煮3分钟',
      '勾芡撒花椒粉和葱花即可'
    ],
    cookingTime: '18分钟',
    difficulty: '中等',
    tags: ['川菜', '麻辣', '素食'],
    category: '川菜',
    scores: { healthy: 7, simple: 6, difficulty: 5, quick: 7, vegetarian: 8, spicy: 9 }
  },
  {
    id: '5',
    name: '蒜蓉西兰花',
    description: '清爽素菜，营养丰富',
    ingredients: ['西兰花 1颗', '大蒜 4瓣', '盐 适量', '生抽 1勺', '香油 几滴'],
    steps: [
      '西兰花洗净切小朵',
      '开水焯烫2分钟捞起',
      '蒜切末爆香',
      '倒入西兰花快速翻炒',
      '调味出锅即可'
    ],
    cookingTime: '10分钟',
    difficulty: '简单',
    tags: ['素食', '健康', '清爽'],
    category: '素食菜品',
    scores: { healthy: 10, simple: 8, difficulty: 2, quick: 8, vegetarian: 10, spicy: 0 }
  },
  {
    id: '6',
    name: '红烧肉',
    description: '传统名菜，肥而不腻',
    ingredients: ['五花肉 500g', '冰糖 30g', '生抽 3勺', '老抽 1勺', '料酒 2勺', '八角 2个'],
    steps: [
      '五花肉切块，冷水下锅焯水',
      '锅中放冰糖炒糖色',
      '放入肉块翻炒上色',
      '加入调料和开水没过肉块',
      '小火炖煮40分钟收汁即可'
    ],
    cookingTime: '60分钟',
    difficulty: '中等',
    tags: ['传统', '荤菜', '红烧'],
    category: '精品菜',
    scores: { healthy: 4, simple: 4, difficulty: 6, quick: 3, vegetarian: 1, spicy: 0 }
  },
  {
    id: '7',
    name: '酸辣土豆丝',
    description: '爽脆开胃，酸辣可口',
    ingredients: ['土豆 2个', '青椒 1个', '红椒 1个', '干辣椒 适量', '白醋 2勺', '生抽 1勺'],
    steps: [
      '土豆切丝用水冲洗淀粉',
      '青红椒切丝',
      '热锅爆香干辣椒',
      '下土豆丝大火翻炒',
      '加入调料和青红椒丝炒匀即可'
    ],
    cookingTime: '12分钟',
    difficulty: '简单',
    tags: ['素食', '开胃', '酸辣'],
    category: '素食菜品',
    scores: { healthy: 8, simple: 8, difficulty: 3, quick: 8, vegetarian: 10, spicy: 6 }
  },
  {
    id: '8',
    name: '糖醋排骨',
    description: '酸甜可口，老少皆宜',
    ingredients: ['排骨 500g', '冰糖 50g', '生抽 3勺', '老抽 1勺', '料酒 2勺', '白醋 3勺'],
    steps: [
      '排骨洗净切段焯水',
      '锅中放少量油炒糖色',
      '放入排骨翻炒上色',
      '加入调料和开水焖煮30分钟',
      '大火收汁撒芝麻即可'
    ],
    cookingTime: '45分钟',
    difficulty: '中等',
    tags: ['甜品', '荤菜', '糖醋'],
    category: '家常菜',
    scores: { healthy: 5, simple: 5, difficulty: 6, quick: 4, vegetarian: 1, spicy: 0 }
  },
  {
    id: '9',
    name: '水蒸蛋羹',
    description: '嫩滑如丝，营养丰富的经典蒸蛋',
    ingredients: ['鸡蛋 3个', '温水 200ml', '盐 少许', '香油 几滴', '葱花 适量', '生抽 1勺'],
    steps: [
      '鸡蛋打散，加入盐搅拌均匀',
      '缓慢倒入温水，边倒边搅拌',
      '过筛去除泡沫，倒入蒸碗',
      '盖上保鲜膜，用牙签扎几个小孔',
      '蒸锅水开后蒸12分钟',
      '出锅后淋香油、生抽，撒葱花即可'
    ],
    cookingTime: '20分钟',
    difficulty: '简单',
    tags: ['蒸菜', '嫩滑', '营养', '清淡'],
    category: '健康菜品',
    scores: { healthy: 9, simple: 8, difficulty: 2, quick: 7, vegetarian: 6, spicy: 0 }
  },
  {
    id: '10',
    name: '红烧排骨',
    description: '色泽红亮，肉质软烂，香甜可口',
    ingredients: ['排骨 600g', '生姜 3片', '八角 2个', '桂皮 1段', '冰糖 40g', '生抽 4勺', '老抽 2勺', '料酒 3勺'],
    steps: [
      '排骨剁段，冷水下锅焯水去血沫',
      '热锅下冰糖小火炒至焦糖色',
      '下排骨翻炒至上色均匀',
      '加入姜片、八角、桂皮炒香',
      '倒入生抽、老抽、料酒炒匀',
      '加开水没过排骨，大火烧开转小火',
      '盖盖炖煮45分钟至软烂',
      '大火收汁至浓稠即可'
    ],
    cookingTime: '65分钟',
    difficulty: '中等',
    tags: ['红烧', '软烂', '下饭', '家常'],
    category: '家常菜',
    scores: { healthy: 6, simple: 5, difficulty: 5, quick: 3, vegetarian: 1, spicy: 0 }
  },
  {
    id: '11',
    name: '凉拌黄瓜',
    description: '清脆爽口，开胃解腻的经典凉菜',
    ingredients: ['黄瓜 2根', '大蒜 3瓣', '香菜 适量', '生抽 2勺', '香醋 2勺', '香油 1勺', '盐 适量', '糖 少许', '辣椒油 适量'],
    steps: [
      '黄瓜洗净，用刀拍扁后切段',
      '撒盐腌制10分钟，挤出水分',
      '大蒜切末，香菜切段',
      '调制料汁：生抽、香醋、香油、糖、辣椒油',
      '将黄瓜、蒜末、香菜混合',
      '淋上调料汁拌匀即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['凉菜', '爽口', '开胃', '素食'],
    category: '凉菜',
    scores: { healthy: 9, simple: 9, difficulty: 1, quick: 9, vegetarian: 10, spicy: 3 }
  }
];

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
        .slice(0, 9);
      
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
          .slice(0, 9);
          
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
          .slice(0, 9);
      } else {
        // Fallback to mock data if API fails
        fallbackDishes = mockDishes
          .map(dish => ({
            ...dish,
            matchScore: calculateMatchScore(dish)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 9);
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