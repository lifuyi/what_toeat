// 应用配置文件
export const CONFIG = {
	// API配置
	API: {
		// 开发环境
		DEV_BASE_URL: 'http://localhost:3001',
		// 生产环境 (根据实际部署调整)
		PROD_BASE_URL: 'http://localhost:3001', // 临时使用开发环境URL
		// 请求超时时间
		TIMEOUT: 10000,
		// 重试次数
		RETRY_COUNT: 3
	},
	
	// 应用信息
	APP: {
		NAME: '今天吃什么',
		VERSION: '1.0.0',
		DESCRIPTION: 'AI智能美食推荐应用'
	},
	
	// 存储键名
	STORAGE_KEYS: {
		FAVORITES: 'favorites',
		INGREDIENT_SEARCH: 'ingredientSearch',
		USER_PREFERENCES: 'userPreferences',
		SEARCH_HISTORY: 'searchHistory'
	},
	
	// 默认偏好设置
	DEFAULT_PREFERENCES: {
		healthy: 5,
		difficulty: 2,
		vegetarian: 5,
		spicy: 5,
		sweetness: 5
	},
	
	// 预设配置
	PRESETS: [
		{
			name: '健康达人',
			emoji: '🥗',
			description: '注重营养均衡',
			preferences: { healthy: 10, difficulty: 1, vegetarian: 8, spicy: 2, sweetness: 3 }
		},
		{
			name: '简单易做',
			emoji: '⚡',
			description: '制作简单快手',
			preferences: { healthy: 6, difficulty: 1, vegetarian: 5, spicy: 4, sweetness: 5 }
		},
		{
			name: '素食主义',
			emoji: '🥬',
			description: '纯素食菜品',
			preferences: { healthy: 9, difficulty: 2, vegetarian: 10, spicy: 3, sweetness: 4 }
		},
		{
			name: '重口味',
			emoji: '🌶️',
			description: '香辣刺激',
			preferences: { healthy: 4, difficulty: 3, vegetarian: 3, spicy: 10, sweetness: 2 }
		},
		{
			name: '精致烹饪',
			emoji: '👨‍🍳',
			description: '复杂精美菜品',
			preferences: { healthy: 7, difficulty: 3, vegetarian: 4, spicy: 5, sweetness: 6 }
		},
		{
			name: '均衡口味',
			emoji: '⚖️',
			description: '中等偏好',
			preferences: { healthy: 5, difficulty: 2, vegetarian: 5, spicy: 5, sweetness: 5 }
		}
	]
};

// 获取当前环境的API基础URL
export function getBaseUrl() {
	// #ifdef H5
	// H5环境：开发时使用本地服务器，生产时使用线上服务器
	if (process.env.NODE_ENV === 'development') {
		return CONFIG.API.DEV_BASE_URL;
	}
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef MP-WEIXIN
	// 微信小程序：开发环境使用本地服务器（需要开启不校验合法域名）
	return CONFIG.API.DEV_BASE_URL;
	// #endif
	
	// #ifdef MP-ALIPAY
	// 支付宝小程序：必须使用https
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef MP-BAIDU
	// 百度小程序：必须使用https
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef MP-TOUTIAO
	// 字节跳动小程序：必须使用https
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef MP-QQ
	// QQ小程序：必须使用https
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef MP-KUAISHOU
	// 快手小程序：必须使用https
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// #ifdef APP-PLUS
	// App环境：可以使用http，但生产环境建议使用https
	if (process.env.NODE_ENV === 'development') {
		return CONFIG.API.DEV_BASE_URL;
	}
	return CONFIG.API.PROD_BASE_URL;
	// #endif
	
	// 默认返回开发环境URL
	return CONFIG.API.DEV_BASE_URL;
}

// 判断是否为开发环境
export function isDev() {
	// #ifdef H5
	return process.env.NODE_ENV === 'development';
	// #endif
	
	// #ifdef APP-PLUS
	return process.env.NODE_ENV === 'development';
	// #endif
	
	// 小程序环境通常认为是生产环境
	return false;
}

// 获取当前平台信息
export function getPlatform() {
	// #ifdef H5
	return 'h5';
	// #endif
	
	// #ifdef MP-WEIXIN
	return 'mp-weixin';
	// #endif
	
	// #ifdef MP-ALIPAY
	return 'mp-alipay';
	// #endif
	
	// #ifdef MP-BAIDU
	return 'mp-baidu';
	// #endif
	
	// #ifdef MP-TOUTIAO
	return 'mp-toutiao';
	// #endif
	
	// #ifdef MP-QQ
	return 'mp-qq';
	// #endif
	
	// #ifdef MP-KUAISHOU
	return 'mp-kuaishou';
	// #endif
	
	// #ifdef APP-PLUS
	return 'app-plus';
	// #endif
	
	return 'unknown';
}

// 检查当前平台是否支持某个功能
export function checkPlatformSupport(feature) {
	const platform = getPlatform();
	
	const supportMatrix = {
		// 网络请求支持
		'http': ['h5', 'app-plus'], // 小程序只支持https
		'https': ['h5', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq', 'mp-kuaishou', 'app-plus'],
		
		// 本地存储支持
		'localStorage': ['h5', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq', 'mp-kuaishou', 'app-plus'],
		
		// 位置信息支持
		'location': ['h5', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq', 'app-plus'],
		
		// 分享功能支持
		'share': ['mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq', 'app-plus'],
		
		// 支付功能支持
		'payment': ['mp-weixin', 'mp-alipay', 'app-plus'],
		
		// 摄像头支持
		'camera': ['h5', 'mp-weixin', 'mp-alipay', 'mp-baidu', 'mp-toutiao', 'mp-qq', 'app-plus']
	};
	
	return supportMatrix[feature]?.includes(platform) || false;
}

export default CONFIG;