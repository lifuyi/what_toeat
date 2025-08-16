// API测试工具
import api from './api.js'

// 测试API连接
export async function testApiConnection() {
	console.log('开始测试API连接...');
	
	try {
		// 测试获取所有菜品
		console.log('测试获取所有菜品...');
		const allRecipes = await api.getAllRecipes();
		console.log('✅ 获取所有菜品成功:', allRecipes.length, '个菜品');
		
		// 测试推荐功能
		console.log('测试推荐功能...');
		const testPreferences = {
			healthy: 7,
			difficulty: 2,
			vegetarian: 5,
			spicy: 3,
			sweetness: 6
		};
		const recommendations = await api.getRecommendedRecipes(testPreferences);
		console.log('✅ 推荐功能测试成功:', recommendations.length, '个推荐');
		
		// 测试搜索功能
		console.log('测试搜索功能...');
		const searchResults = await api.searchRecipes('鸡蛋');
		console.log('✅ 搜索功能测试成功:', searchResults.length, '个结果');
		
		// 测试食材搜索
		console.log('测试食材搜索...');
		const ingredientResults = await api.searchRecipesByIngredients(['番茄', '鸡蛋']);
		console.log('✅ 食材搜索测试成功:', ingredientResults.length, '个结果');
		
		console.log('🎉 所有API测试通过！');
		return true;
		
	} catch (error) {
		console.error('❌ API测试失败:', error);
		api.handleApiError(error);
		return false;
	}
}

// 测试数据转换
export function testDataConversion() {
	console.log('测试数据转换...');
	
	const mockServerData = {
		id: 'test_1',
		name: '测试菜品',
		description: '这是一个测试菜品',
		ingredients: ['测试食材1', '测试食材2'],
		instructions: ['步骤1', '步骤2', '步骤3'],
		cookingTime: '30分钟',
		difficulty_level: 2,
		tags: ['测试', '简单'],
		healthy_score: 8,
		spicy_level: 3,
		sweetness_level: 4,
		vegetarian_score: 6
	};
	
	const convertedDish = api.convertRecipeToDish(mockServerData);
	console.log('✅ 数据转换测试成功:', convertedDish);
	
	// 测试匹配分数计算
	const testPreferences = {
		healthy: 7,
		difficulty: 2,
		vegetarian: 5,
		spicy: 3,
		sweetness: 4
	};
	
	const matchScore = api.calculateMatchScore(convertedDish, testPreferences);
	console.log('✅ 匹配分数计算测试成功:', matchScore, '%');
	
	return convertedDish;
}

export default {
	testApiConnection,
	testDataConversion
};