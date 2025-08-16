// API service for UniApp to communicate with backend server
import { getBaseUrl, getPlatform, checkPlatformSupport } from './config.js'

const BASE_URL = getBaseUrl(); // 动态获取API基础URL
const CURRENT_PLATFORM = getPlatform();

// 通用请求函数
function request(url, options = {}) {
	return new Promise((resolve, reject) => {
		// 检查网络协议支持
		const isHttps = BASE_URL.startsWith('https://');
		const isHttp = BASE_URL.startsWith('http://');
		
		// 小程序环境检查HTTPS要求
		if (!isHttps && CURRENT_PLATFORM.startsWith('mp-')) {
			console.warn(`警告: ${CURRENT_PLATFORM} 平台要求使用HTTPS协议`);
			// 在小程序环境下，如果是HTTP，尝试转换为HTTPS
			if (isHttp) {
				const httpsUrl = BASE_URL.replace('http://', 'https://');
				console.log(`自动转换为HTTPS: ${httpsUrl}`);
			}
		}
		
		const config = {
			url: BASE_URL + url,
			method: options.method || 'GET',
			header: {
				'Content-Type': 'application/json',
				// 添加平台标识
				'X-Platform': CURRENT_PLATFORM,
				'X-Client': 'UniApp-WhatToEat',
				...options.header
			},
			timeout: getPlatformTimeout(),
			success: (res) => {
				console.log(`[${CURRENT_PLATFORM}] API ${options.method || 'GET'} ${url}:`, res.statusCode);
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					const errorMsg = getPlatformErrorMessage(res.statusCode, res.data);
					reject(new Error(errorMsg));
				}
			},
			fail: (err) => {
				console.error(`[${CURRENT_PLATFORM}] Request failed:`, err);
				const errorMsg = getPlatformNetworkError(err);
				reject(new Error(errorMsg));
			}
		};
		
		// 根据请求方法设置数据
		if (options.method === 'GET') {
			config.data = options.data || {};
		} else {
			config.data = options.data || {};
		}
		
		console.log(`[${CURRENT_PLATFORM}] API Request: ${config.method} ${config.url}`, config.data);
		uni.request(config);
	});
}

// 获取平台特定的超时时间
function getPlatformTimeout() {
	switch (CURRENT_PLATFORM) {
		case 'mp-weixin':
		case 'mp-alipay':
		case 'mp-baidu':
		case 'mp-toutiao':
		case 'mp-qq':
		case 'mp-kuaishou':
			return 20000; // 小程序网络较慢，增加超时时间
		case 'h5':
			return 10000; // H5默认超时
		case 'app-plus':
			return 15000; // App环境
		default:
			return 10000;
	}
}

// 获取平台特定的错误信息
function getPlatformErrorMessage(statusCode, data) {
	const baseMsg = `HTTP ${statusCode}: ${data?.message || 'Request failed'}`;
	
	switch (CURRENT_PLATFORM) {
		case 'mp-weixin':
			if (statusCode === 600) {
				return '微信小程序网络超时，请检查网络连接';
			}
			break;
		case 'mp-alipay':
			if (statusCode === 11) {
				return '支付宝小程序网络异常，请稍后重试';
			}
			break;
		case 'h5':
			if (statusCode === 0) {
				return '网络连接失败，请检查CORS配置或网络状态';
			}
			break;
	}
	
	return baseMsg;
}

// 获取平台特定的网络错误信息
function getPlatformNetworkError(err) {
	switch (CURRENT_PLATFORM) {
		case 'mp-weixin':
			if (err.errMsg?.includes('timeout')) {
				return '微信小程序请求超时，请检查网络连接';
			}
			if (err.errMsg?.includes('fail')) {
				return '微信小程序网络请求失败，请检查服务器域名是否已配置';
			}
			break;
			
		case 'mp-alipay':
			if (err.error === 11) {
				return '支付宝小程序网络连接失败';
			}
			break;
			
		case 'h5':
			if (err.message?.includes('CORS')) {
				return 'H5跨域请求被阻止，请检查服务器CORS配置';
			}
			break;
			
		case 'app-plus':
			if (err.errMsg?.includes('timeout')) {
				return 'App网络请求超时，请检查网络连接';
			}
			break;
	}
	
	return `网络请求失败 (${CURRENT_PLATFORM})，请检查网络连接和服务器状态`;
}

// 获取推荐菜品
export function getRecommendedRecipes(preferences) {
	return request('/api/recommendations', {
		method: 'POST',
		data: preferences
	});
}

// 搜索菜品
export function searchRecipes(query) {
	return request('/api/recipes', {
		method: 'GET',
		data: { query }
	});
}

// 根据食材搜索菜品
export function searchRecipesByIngredients(ingredients) {
	const query = ingredients.join(' ');
	return request('/api/recipes/ingredients', {
		method: 'GET',
		data: { 
			query,
			mode: 'or',
			limit: 12
		}
	});
}

// 获取菜品详情
export function getRecipeById(id) {
	return request(`/api/recipes/${id}`);
}

// 获取所有菜品
export function getAllRecipes() {
	return request('/api/recipes');
}

// 转换后端数据格式为前端格式
export function convertRecipeToDish(recipe) {
	// 处理食材列表
	const ingredients = recipe.yl ? recipe.yl.split(/[,，、\n]/).filter(item => item.trim()) : [];
	
	// 处理制作步骤
	const steps = recipe.steptext ? recipe.steptext.split(/\d+[\.、]/).filter(step => step.trim()) : [];
	
	// 处理标签
	const tags = [];
	if (recipe.fl) tags.push(...recipe.fl.split(/[,，、]/).filter(tag => tag.trim()));
	if (recipe.difficulty) tags.push(getDifficultyText(recipe.difficulty));
	if (recipe.costtime) tags.push(recipe.costtime);
	
	return {
		id: recipe.id,
		name: recipe.title || '未知菜品',
		description: recipe.desc || recipe.tip || '',
		ingredients: ingredients,
		steps: steps,
		cookingTime: recipe.costtime || '未知',
		difficulty: getDifficultyText(recipe.difficulty || recipe['制作难易']),
		tags: tags,
		category: recipe.fl || '家常菜',
		scores: {
			healthy: recipe['健康度'] || recipe.健康度 || 5,
			difficulty: recipe['制作难易'] || recipe.制作难易 || 2,
			vegetarian: recipe['素食偏好'] || recipe.素食偏好 || 5,
			spicy: recipe['辛辣程度'] || recipe.辛辣程度 || 5,
			sweetness: recipe['甜度'] || recipe.甜度 || 5
		},
		matchScore: recipe.matchScore || recipe.matchPercentage || 0,
		grade: recipe.grade || 0,
		viewnum: recipe.viewnum || 0,
		favnum: recipe.favnum || 0
	};
}

// 难度等级转换
function getDifficultyText(level) {
	const difficultyMap = {
		1: '简单',
		2: '中等',
		3: '困难'
	};
	return difficultyMap[level] || '中等';
}

// 计算匹配分数
export function calculateMatchScore(dish, preferences) {
	if (!dish.scores || !preferences) return 0;
	
	const weights = {
		healthy: 0.25,
		difficulty: 0.15,
		vegetarian: 0.2,
		spicy: 0.2,
		sweetness: 0.2
	};
	
	let totalScore = 0;
	let totalWeight = 0;
	
	for (const [key, weight] of Object.entries(weights)) {
		if (dish.scores[key] !== undefined && preferences[key] !== undefined) {
			// 计算相似度 (1 - 差值的绝对值 / 最大可能差值)
			const similarity = 1 - Math.abs(dish.scores[key] - preferences[key]) / 9;
			totalScore += similarity * weight;
			totalWeight += weight;
		}
	}
	
	return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

// 错误处理
export function handleApiError(error) {
	console.error('API Error:', error);
	
	let message = '请求失败';
	if (error.message) {
		if (error.message.includes('网络')) {
			message = '网络连接失败，请检查网络设置';
		} else if (error.message.includes('timeout')) {
			message = '请求超时，请稍后重试';
		} else {
			message = error.message;
		}
	}
	
	uni.showToast({
		title: message,
		icon: 'none',
		duration: 2000
	});
	
	return message;
}

// 默认导出
export default {
	getRecommendedRecipes,
	searchRecipes,
	searchRecipesByIngredients,
	getRecipeById,
	getAllRecipes,
	convertRecipeToDish,
	calculateMatchScore,
	handleApiError
};