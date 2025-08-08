// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3001';

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
  simple: number;
  difficulty: number;
  quick: number;
  vegetarian: number;
  spicy: number;
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
  if (recipe.fl) tags.push(recipe.fl);

  // Add category from database
  let category = '家常菜';
  if (recipe.fl) {
    category = recipe.fl;
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
      simple: 10 - recipe.制作难易, // Invert difficulty for simplicity
      difficulty: recipe.制作难易,
      quick: recipe.制作速度,
      vegetarian: recipe.素食偏好,
      spicy: recipe.辛辣程度
    }
  };
}

// Fetch all recipes
export async function fetchRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes`);
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
export async function searchRecipes(query: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recipes?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

// Get recommended recipes based on preferences
export async function getRecommendedRecipes(preferences: Preferences): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fallback to regular recipes if recommendations endpoint fails
    return await fetchRecipes();
  }
}