import { mockDishes } from '../data/mockDishes.js'

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 计算菜品与偏好的匹配度
function calculateMatchScore(dish, preferences) {
  const weights = {
    healthy: 0.25,
    difficulty: 0.15,
    vegetarian: 0.2,
    spicy: 0.2,
    sweetness: 0.2
  }
  
  let score = 0
  
  // 健康度匹配
  const healthyDiff = Math.abs(dish.scores.healthy - preferences.healthy)
  score += (10 - healthyDiff) * weights.healthy
  
  // 难度匹配（偏好越低越好）
  const difficultyMatch = preferences.difficulty >= dish.scores.difficulty ? 10 : 5
  score += difficultyMatch * weights.difficulty
  
  // 素食偏好匹配
  const vegetarianDiff = Math.abs(dish.scores.vegetarian - preferences.vegetarian)
  score += (10 - vegetarianDiff) * weights.vegetarian
  
  // 辣度匹配
  const spicyDiff = Math.abs(dish.scores.spicy - preferences.spicy)
  score += (10 - spicyDiff) * weights.spicy
  
  // 甜度匹配
  const sweetnessDiff = Math.abs(dish.scores.sweetness - preferences.sweetness)
  score += (10 - sweetnessDiff) * weights.sweetness
  
  return Math.round(score * 10) / 10
}

// 根据偏好获取推荐菜谱
export async function getRecommendedRecipes(preferences) {
  await delay(800) // 模拟网络延迟
  
  try {
    const dishesWithScores = mockDishes.map(dish => ({
      ...dish,
      matchScore: calculateMatchScore(dish, preferences)
    }))
    
    // 按匹配度排序
    const sortedDishes = dishesWithScores.sort((a, b) => b.matchScore - a.matchScore)
    
    return {
      success: true,
      data: sortedDishes.slice(0, 8), // 返回前8个最匹配的
      total: sortedDishes.length
    }
  } catch (error) {
    return {
      success: false,
      error: '获取推荐菜谱失败',
      data: []
    }
  }
}

// 根据关键词搜索菜谱
export async function searchRecipes(searchTerm) {
  await delay(600)
  
  try {
    if (!searchTerm.trim()) {
      return {
        success: true,
        data: mockDishes.slice(0, 6),
        total: mockDishes.length
      }
    }
    
    const filteredDishes = mockDishes.filter(dish => 
      dish.name.includes(searchTerm) ||
      dish.description.includes(searchTerm) ||
      dish.tags.some(tag => tag.includes(searchTerm)) ||
      dish.category.includes(searchTerm)
    )
    
    return {
      success: true,
      data: filteredDishes,
      total: filteredDishes.length
    }
  } catch (error) {
    return {
      success: false,
      error: '搜索菜谱失败',
      data: []
    }
  }
}

// 根据食材搜索菜谱
export async function searchRecipesByIngredients(ingredients) {
  await delay(700)
  
  try {
    if (!ingredients || ingredients.length === 0) {
      return {
        success: true,
        data: mockDishes.slice(0, 6),
        total: mockDishes.length
      }
    }
    
    const filteredDishes = mockDishes.filter(dish => {
      // 计算匹配的食材数量
      const matchedIngredients = ingredients.filter(ingredient =>
        dish.ingredients.some(dishIngredient => 
          dishIngredient.includes(ingredient) || ingredient.includes(dishIngredient)
        )
      )
      
      // 至少匹配一个食材
      return matchedIngredients.length > 0
    })
    
    // 按匹配食材数量排序
    const sortedDishes = filteredDishes.map(dish => {
      const matchedCount = ingredients.filter(ingredient =>
        dish.ingredients.some(dishIngredient => 
          dishIngredient.includes(ingredient) || ingredient.includes(dishIngredient)
        )
      ).length
      
      return {
        ...dish,
        matchedIngredients: matchedCount,
        matchScore: (matchedCount / ingredients.length) * 10
      }
    }).sort((a, b) => b.matchedIngredients - a.matchedIngredients)
    
    return {
      success: true,
      data: sortedDishes,
      total: sortedDishes.length
    }
  } catch (error) {
    return {
      success: false,
      error: '根据食材搜索失败',
      data: []
    }
  }
}

// 获取菜谱详情
export async function getRecipeDetail(id) {
  await delay(300)
  
  try {
    const dish = mockDishes.find(dish => dish.id === id)
    
    if (!dish) {
      return {
        success: false,
        error: '菜谱不存在',
        data: null
      }
    }
    
    return {
      success: true,
      data: dish
    }
  } catch (error) {
    return {
      success: false,
      error: '获取菜谱详情失败',
      data: null
    }
  }
}

// 获取热门菜谱
export async function getPopularRecipes(limit = 6) {
  await delay(500)
  
  try {
    // 模拟热门菜谱（按健康度和简单程度排序）
    const popularDishes = mockDishes
      .sort((a, b) => {
        const scoreA = a.scores.healthy + (4 - a.scores.difficulty)
        const scoreB = b.scores.healthy + (4 - b.scores.difficulty)
        return scoreB - scoreA
      })
      .slice(0, limit)
    
    return {
      success: true,
      data: popularDishes,
      total: popularDishes.length
    }
  } catch (error) {
    return {
      success: false,
      error: '获取热门菜谱失败',
      data: []
    }
  }
}

// 转换菜谱格式（兼容原有代码）
export function convertRecipeToDish(recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    category: recipe.category,
    scores: recipe.scores
  }
}