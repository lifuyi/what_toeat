<template>
	<view class="container">
		<view class="header">
			<text class="title">API连接测试</text>
			<view class="platform-info">
				<text class="platform-text">当前平台: {{ currentPlatform }}</text>
				<text class="platform-text">API地址: {{ apiBaseUrl }}</text>
				<text class="platform-text">支持功能: {{ supportedFeatures.join(', ') }}</text>
			</view>
		</view>
		
		<view class="test-section">
			<button class="test-btn" @tap="testConnection" :disabled="testing">
				<text v-if="testing">测试中...</text>
				<text v-else>🔗 测试API连接</text>
			</button>
			
			<button class="test-btn" @tap="testRecommendations" :disabled="testing">
				<text v-if="testing">测试中...</text>
				<text v-else>🎯 测试推荐功能</text>
			</button>
			
			<button class="test-btn" @tap="testSearch" :disabled="testing">
				<text v-if="testing">测试中...</text>
				<text v-else>🔍 测试搜索功能</text>
			</button>
			
			<button class="test-btn" @tap="testIngredientSearch" :disabled="testing">
				<text v-if="testing">测试中...</text>
				<text v-else>🥬 测试食材搜索</text>
			</button>
		</view>
		
		<view class="results-section">
			<text class="results-title">测试结果:</text>
			<scroll-view class="results-scroll" scroll-y>
				<view v-for="(result, index) in testResults" :key="index" class="result-item">
					<text class="result-status" :class="result.success ? 'success' : 'error'">
						{{ result.success ? '✅' : '❌' }}
					</text>
					<text class="result-text">{{ result.message }}</text>
				</view>
			</scroll-view>
		</view>
		
		<view v-if="lastResponse" class="response-section">
			<text class="response-title">最新响应数据:</text>
			<scroll-view class="response-scroll" scroll-y>
				<text class="response-text">{{ JSON.stringify(lastResponse, null, 2) }}</text>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import api from '../../utils/api.js'
import { CONFIG, getPlatform } from '../../utils/config.js'
import platform from '../../utils/platform.js'

export default {
	data() {
		return {
			testing: false,
			testResults: [],
			lastResponse: null,
			platformInfo: {},
			currentPlatform: getPlatform(),
			apiBaseUrl: '',
			supportedFeatures: []
		}
	},
	async onLoad() {
		this.apiBaseUrl = CONFIG.API.DEV_BASE_URL;
		this.supportedFeatures = platform.features.getSupportedFeatures();
		
		// 获取平台信息
		this.platformInfo = await platform.device.getDeviceInfo();
		
		this.addResult(true, `页面加载完成 - 平台: ${this.currentPlatform}`);
		this.addResult(true, `API地址: ${this.apiBaseUrl}`);
		this.addResult(true, `支持功能: ${this.supportedFeatures.join(', ')}`);
		
		// 检查网络状态
		const isConnected = await platform.network.isConnected();
		if (isConnected) {
			this.addResult(true, '✅ 网络连接正常');
		} else {
			this.addResult(false, '❌ 网络连接异常');
		}
	},
	methods: {
		addResult(success, message) {
			this.testResults.push({
				success,
				message,
				timestamp: new Date().toLocaleTimeString()
			});
		},
		
		async testConnection() {
			this.testing = true;
			this.addResult(true, '开始测试基础连接...');
			
			try {
				const recipes = await api.getAllRecipes();
				this.lastResponse = recipes;
				this.addResult(true, `✅ 连接成功！获取到 ${recipes.length} 个菜品`);
				
				if (recipes.length > 0) {
					const firstRecipe = api.convertRecipeToDish(recipes[0]);
					this.addResult(true, `✅ 数据转换成功：${firstRecipe.name}`);
				}
			} catch (error) {
				this.addResult(false, `❌ 连接失败：${error.message}`);
				console.error('Connection test failed:', error);
			} finally {
				this.testing = false;
			}
		},
		
		async testRecommendations() {
			this.testing = true;
			this.addResult(true, '开始测试推荐功能...');
			
			try {
				const testPreferences = {
					healthy: 7,
					simple: 5,
					difficulty: 2,
					quick: 6,
					vegetarian: 4,
					spicy: 3
				};
				
				const recommendations = await api.getRecommendedRecipes(testPreferences);
				this.lastResponse = recommendations;
				this.addResult(true, `✅ 推荐功能正常！获取到 ${recommendations.length} 个推荐`);
				
				if (recommendations.length > 0) {
					const converted = recommendations.map(r => api.convertRecipeToDish(r));
					this.addResult(true, `✅ 推荐菜品：${converted.slice(0, 3).map(d => d.name).join(', ')}`);
				}
			} catch (error) {
				this.addResult(false, `❌ 推荐测试失败：${error.message}`);
				console.error('Recommendations test failed:', error);
			} finally {
				this.testing = false;
			}
		},
		
		async testSearch() {
			this.testing = true;
			this.addResult(true, '开始测试搜索功能...');
			
			try {
				const searchResults = await api.searchRecipes('鸡蛋');
				this.lastResponse = searchResults;
				this.addResult(true, `✅ 搜索功能正常！找到 ${searchResults.length} 个结果`);
				
				if (searchResults.length > 0) {
					const converted = searchResults.map(r => api.convertRecipeToDish(r));
					this.addResult(true, `✅ 搜索结果：${converted.slice(0, 3).map(d => d.name).join(', ')}`);
				}
			} catch (error) {
				this.addResult(false, `❌ 搜索测试失败：${error.message}`);
				console.error('Search test failed:', error);
			} finally {
				this.testing = false;
			}
		},
		
		async testIngredientSearch() {
			this.testing = true;
			this.addResult(true, '开始测试食材搜索...');
			
			try {
				const ingredientResults = await api.searchRecipesByIngredients(['番茄', '鸡蛋']);
				this.lastResponse = ingredientResults;
				
				// 处理食材搜索的特殊响应格式
				const results = ingredientResults.results || ingredientResults;
				this.addResult(true, `✅ 食材搜索正常！找到 ${results.length} 个结果`);
				
				if (results.length > 0) {
					const converted = results.map(r => api.convertRecipeToDish(r));
					this.addResult(true, `✅ 食材搜索结果：${converted.slice(0, 3).map(d => d.name).join(', ')}`);
					
					// 显示匹配度信息
					if (results[0].matchPercentage !== undefined) {
						this.addResult(true, `✅ 匹配度计算正常：${results[0].matchPercentage}%`);
					}
				}
			} catch (error) {
				this.addResult(false, `❌ 食材搜索测试失败：${error.message}`);
				console.error('Ingredient search test failed:', error);
			} finally {
				this.testing = false;
			}
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #ffffff;
	padding: 30rpx;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 20rpx;
}

.platform-info {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15rpx;
	padding: 20rpx;
	margin-top: 20rpx;
}

.platform-text {
	display: block;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 8rpx;
	line-height: 1.4;
}

.platform-text:last-child {
	margin-bottom: 0;
}

.test-section {
	margin-bottom: 40rpx;
}

.test-btn {
	width: 100%;
	padding: 30rpx;
	margin-bottom: 20rpx;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 20rpx;
	border: none;
	color: white;
	font-size: 28rpx;
	font-weight: bold;
}

.test-btn[disabled] {
	opacity: 0.5;
}

.results-section {
	margin-bottom: 40rpx;
}

.results-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 20rpx;
	display: block;
}

.results-scroll {
	height: 400rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 20rpx;
}

.result-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 15rpx;
	padding: 10rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10rpx;
}

.result-status {
	margin-right: 15rpx;
	font-size: 24rpx;
}

.result-text {
	flex: 1;
	color: white;
	font-size: 24rpx;
	line-height: 1.4;
}

.success {
	color: #10b981;
}

.error {
	color: #ef4444;
}

.response-section {
	margin-bottom: 40rpx;
}

.response-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 20rpx;
	display: block;
}

.response-scroll {
	height: 300rpx;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 20rpx;
	padding: 20rpx;
}

.response-text {
	color: #10b981;
	font-size: 22rpx;
	font-family: monospace;
	line-height: 1.4;
}
</style>