// API service for communicating with the backend
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Recipe {
  id: number;
  did?: number;
  cid?: string;
  zid?: string;
  title: string;
  thumb?: string;
  videourl?: string;
  desc?: string;
  difficulty: number;
  costtime: string;
  tip?: string;
  yl?: string; // 原料/食材
  fl?: string; // 分类
  steptext?: string;
  steppic?: string;
  grade?: number;
  up?: number;
  viewnum?: number;
  favnum?: number;
  outdate?: number;
  status?: number;
  健康度: number;
  制作难易: number;
  制作速度: number;
  素食偏好: number;
  辛辣程度: number;
  甜度: number;
}

export interface Preferences {
  healthy: number;
  difficulty: number;
  vegetarian: number;
  spicy: number;
  sweetness: number;
}

// Convert database recipe to client Dish format
export function convertRecipeToDish(recipe: Recipe) {
  // Parse ingredients from yl field
  const ingredients = recipe.yl ? recipe.yl.split('#').filter(item => item.trim()) : [];
  
  // Parse steps from steptext field
  const steps = recipe.steptext ? 
    recipe.steptext.split('#').filter(item => item.trim()).map(step => 
      step.replace(/^\d+\.\s*▲?\s*/, '').trim()
    ) : [];

  // Map difficulty number to text
  const difficultyMap: { [key: number]: string } = {
    0: '简单',
    1: '简单',
    2: '中等',
    3: '困难'
  };

  // Generate tags based on recipe properties
  const tags: string[] = [];
  if (recipe.素食偏好 >= 7) tags.push('素食');
  if (recipe.健康度 >= 7) tags.push('健康');
  if (recipe.制作速度 >= 7) tags.push('快手');
  if (recipe.辛辣程度 >= 7) tags.push('辣');
  if (recipe.制作难易 <= 3) tags.push('简单');
  
  // Add tags from yl field (first 3 items split by # as one combined badge with '等')
  if (recipe.yl) {
    const ylItems = recipe.yl.split('#').filter(item => item.trim()).slice(0, 3);
    if (ylItems.length > 0) {
      tags.push(ylItems.join(' ') + '等');
    }
  }

  // Add category from database
  let category = '家常菜';
  if (recipe.yl) {
    const ylItems = recipe.yl.split('#').filter(item => item.trim());
    if (ylItems.length > 0) {
      category = ylItems[0]; // Use first item as category
    }
  } else if (recipe.zid) {
    category = recipe.zid;
  }

  return {
    id: recipe.id.toString(),
    name: recipe.title,
    description: recipe.desc || '美味佳肴\n垂涎欲滴',
    ingredients,
    steps,
    cookingTime: recipe.costtime || '未知',
    difficulty: difficultyMap[recipe.difficulty] || '中等',
    tags,
    category,
    scores: {
      healthy: recipe.健康度,
      difficulty: recipe.制作难易,
      vegetarian: recipe.素食偏好,
      spicy: recipe.辛辣程度,
      sweetness: recipe.甜度
    }
  };
}

// Fetch all recipes
export async function fetchRecipes(signal?: AbortSignal): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

// Search recipes by query
export async function searchRecipes(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes?query=${encodeURIComponent(query)}`, { signal });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json();
    
    // 如果API返回空结果，尝试获取所有数据并在前端搜索
    if (!results || results.length === 0) {
      const allRecipes = await fetchRecipes(signal);
      return performClientSideSearch(allRecipes, query);
    }
    
    return results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    // 如果API完全失败，尝试获取所有数据并在前端搜索
    try {
      const allRecipes = await fetchRecipes(signal);
      return performClientSideSearch(allRecipes, query);
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
      throw error;
    }
  }
}

// 智能搜索函数：同时支持AND搜索和整体词组搜索
function performClientSideSearch(allRecipes: Recipe[], query: string): Recipe[] {
  const searchTerms = query.split(/\s+/).filter(term => term.trim());
  
  // 如果是多个词，同时进行AND搜索和整体搜索，然后合并去重
  if (searchTerms.length > 1) {
    // AND搜索：每个关键词都必须匹配
    const andResults = allRecipes.filter(recipe => {
      return searchTerms.every(term => {
        const lowerTerm = term.toLowerCase();
        return (
          (recipe.title && recipe.title.toLowerCase().includes(lowerTerm)) ||
          (recipe.desc && recipe.desc.toLowerCase().includes(lowerTerm)) ||
          (recipe.yl && recipe.yl.toLowerCase().includes(lowerTerm)) ||
          (recipe.fl && recipe.fl.toLowerCase().includes(lowerTerm)) ||
          // 支持特定的同义词匹配
          (lowerTerm === '蛋' && ((recipe.title && recipe.title.toLowerCase().includes('鸡蛋')) || (recipe.yl && recipe.yl.toLowerCase().includes('鸡蛋')))) ||
          (lowerTerm === '鸡蛋' && ((recipe.title && recipe.title.toLowerCase().includes('蛋')) || (recipe.yl && recipe.yl.toLowerCase().includes('蛋'))))
        );
      });
    });
    
    // 整体搜索：匹配完整查询词组（去掉空格）
    const phraseQuery = searchTerms.join('');
    const phraseResults = allRecipes.filter(recipe => {
      return (
        (recipe.title && recipe.title.toLowerCase().includes(phraseQuery)) ||
        (recipe.desc && recipe.desc.toLowerCase().includes(phraseQuery)) ||
        (recipe.yl && recipe.yl.toLowerCase().includes(phraseQuery)) ||
        (recipe.fl && recipe.fl.toLowerCase().includes(phraseQuery))
      );
    });
    
    // 合并结果并去重，优先显示整体匹配的结果
    const combinedResults = [...phraseResults];
    andResults.forEach(recipe => {
      if (!combinedResults.find(r => r.id === recipe.id)) {
        combinedResults.push(recipe);
      }
    });
    
    return combinedResults;
  } else {
    // 单个词的搜索
    const term = searchTerms[0];
    const lowerTerm = term.toLowerCase();
    
    return allRecipes.filter(recipe => {
      return (
        (recipe.title && recipe.title.toLowerCase().includes(lowerTerm)) ||
        (recipe.desc && recipe.desc.toLowerCase().includes(lowerTerm)) ||
        (recipe.yl && recipe.yl.toLowerCase().includes(lowerTerm)) ||
        (recipe.fl && recipe.fl.toLowerCase().includes(lowerTerm)) ||
        // 支持特定的同义词匹配
        (lowerTerm === '蛋' && ((recipe.title && recipe.title.toLowerCase().includes('鸡蛋')) || (recipe.yl && recipe.yl.toLowerCase().includes('鸡蛋')))) ||
        (lowerTerm === '鸡蛋' && ((recipe.title && recipe.title.toLowerCase().includes('蛋')) || (recipe.yl && recipe.yl.toLowerCase().includes('蛋'))))
      );
    });
  }
}

// Get recommended recipes based on preferences
export async function getRecommendedRecipes(preferences: Preferences, signal?: AbortSignal): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
      signal,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fallback to regular recipes if recommendations endpoint fails
    return await fetchRecipes(signal);
  }
}