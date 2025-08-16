// 平台特定功能处理工具
import { getPlatform, checkPlatformSupport } from './config.js'

// 平台适配的存储操作
export const storage = {
	// 设置存储
	set(key, value) {
		try {
			const data = typeof value === 'string' ? value : JSON.stringify(value);
			uni.setStorageSync(key, data);
			return true;
		} catch (error) {
			console.error('Storage set error:', error);
			return false;
		}
	},
	
	// 获取存储
	get(key, defaultValue = null) {
		try {
			const data = uni.getStorageSync(key);
			if (!data) return defaultValue;
			
			// 尝试解析JSON，失败则返回原始字符串
			try {
				return JSON.parse(data);
			} catch {
				return data;
			}
		} catch (error) {
			console.error('Storage get error:', error);
			return defaultValue;
		}
	},
	
	// 删除存储
	remove(key) {
		try {
			uni.removeStorageSync(key);
			return true;
		} catch (error) {
			console.error('Storage remove error:', error);
			return false;
		}
	},
	
	// 清空存储
	clear() {
		try {
			uni.clearStorageSync();
			return true;
		} catch (error) {
			console.error('Storage clear error:', error);
			return false;
		}
	}
};

// 平台适配的导航操作
export const navigation = {
	// 页面跳转
	navigateTo(url, params = {}) {
		const platform = getPlatform();
		
		// 构建完整URL
		let fullUrl = url;
		if (Object.keys(params).length > 0) {
			const queryString = Object.entries(params)
				.map(([key, value]) => `${key}=${encodeURIComponent(JSON.stringify(value))}`)
				.join('&');
			fullUrl += (url.includes('?') ? '&' : '?') + queryString;
		}
		
		// 平台特定处理
		switch (platform) {
			case 'mp-weixin':
				// 微信小程序路径长度限制
				if (fullUrl.length > 1000) {
					console.warn('微信小程序URL过长，可能导致跳转失败');
				}
				break;
			case 'h5':
				// H5环境可能需要特殊处理
				break;
		}
		
		uni.navigateTo({ url: fullUrl });
	},
	
	// 返回上一页
	navigateBack(delta = 1) {
		uni.navigateBack({ delta });
	},
	
	// 重定向
	redirectTo(url) {
		uni.redirectTo({ url });
	},
	
	// 切换Tab
	switchTab(url) {
		uni.switchTab({ url });
	}
};

// 平台适配的提示操作
export const feedback = {
	// 显示提示
	showToast(title, options = {}) {
		const platform = getPlatform();
		
		const config = {
			title,
			icon: options.icon || 'none',
			duration: options.duration || 2000,
			...options
		};
		
		// 平台特定调整
		switch (platform) {
			case 'mp-weixin':
				// 微信小程序图标限制
				if (!['success', 'loading', 'none'].includes(config.icon)) {
					config.icon = 'none';
				}
				break;
			case 'mp-alipay':
				// 支付宝小程序特殊处理
				if (config.icon === 'error') {
					config.icon = 'none';
				}
				break;
		}
		
		uni.showToast(config);
	},
	
	// 显示加载中
	showLoading(title = '加载中...') {
		uni.showLoading({ title });
	},
	
	// 隐藏加载中
	hideLoading() {
		uni.hideLoading();
	},
	
	// 显示模态对话框
	showModal(title, content, options = {}) {
		return new Promise((resolve) => {
			uni.showModal({
				title,
				content,
				showCancel: options.showCancel !== false,
				cancelText: options.cancelText || '取消',
				confirmText: options.confirmText || '确定',
				success: (res) => {
					resolve(res.confirm);
				},
				fail: () => {
					resolve(false);
				}
			});
		});
	}
};

// 平台适配的网络状态检查
export const network = {
	// 检查网络状态
	getNetworkType() {
		return new Promise((resolve) => {
			uni.getNetworkType({
				success: (res) => {
					resolve(res.networkType);
				},
				fail: () => {
					resolve('unknown');
				}
			});
		});
	},
	
	// 监听网络状态变化
	onNetworkStatusChange(callback) {
		uni.onNetworkStatusChange(callback);
	},
	
	// 检查是否有网络连接
	async isConnected() {
		const networkType = await this.getNetworkType();
		return networkType !== 'none' && networkType !== 'unknown';
	}
};

// 平台适配的设备信息
export const device = {
	// 获取系统信息
	getSystemInfo() {
		return new Promise((resolve) => {
			uni.getSystemInfo({
				success: (res) => {
					resolve(res);
				},
				fail: () => {
					resolve({});
				}
			});
		});
	},
	
	// 获取设备基础信息
	async getDeviceInfo() {
		const systemInfo = await this.getSystemInfo();
		const platform = getPlatform();
		
		return {
			platform,
			system: systemInfo.system || 'unknown',
			version: systemInfo.version || 'unknown',
			model: systemInfo.model || 'unknown',
			pixelRatio: systemInfo.pixelRatio || 1,
			screenWidth: systemInfo.screenWidth || 0,
			screenHeight: systemInfo.screenHeight || 0,
			windowWidth: systemInfo.windowWidth || 0,
			windowHeight: systemInfo.windowHeight || 0,
			statusBarHeight: systemInfo.statusBarHeight || 0,
			safeArea: systemInfo.safeArea || {},
			safeAreaInsets: systemInfo.safeAreaInsets || {}
		};
	}
};

// 平台特性检查
export const features = {
	// 检查是否支持某个功能
	supports(feature) {
		return checkPlatformSupport(feature);
	},
	
	// 获取支持的功能列表
	getSupportedFeatures() {
		const features = ['http', 'https', 'localStorage', 'location', 'share', 'payment', 'camera'];
		return features.filter(feature => this.supports(feature));
	},
	
	// 获取平台限制信息
	getPlatformLimitations() {
		const platform = getPlatform();
		
		const limitations = {
			'mp-weixin': [
				'只支持HTTPS请求',
				'需要配置服务器域名白名单',
				'包体积限制2MB',
				'单个页面栈限制10层'
			],
			'mp-alipay': [
				'只支持HTTPS请求',
				'需要配置服务器域名白名单',
				'包体积限制2MB'
			],
			'h5': [
				'受CORS策略限制',
				'不支持某些原生API',
				'性能受浏览器影响'
			],
			'app-plus': [
				'需要原生插件支持某些功能',
				'打包体积较大'
			]
		};
		
		return limitations[platform] || [];
	}
};

// 导出所有工具
export default {
	storage,
	navigation,
	feedback,
	network,
	device,
	features,
	getPlatform
};