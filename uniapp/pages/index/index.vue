<template>
	<view class="container">
		<!-- Header section -->
		<view class="header">
			<view class="header-content">
				<view class="greeting-section">
					<text class="emoji">✨</text>
					<text class="greeting-text">{{ greeting }}，{{ meal }}吃什么？</text>
					<text class="emoji">🍽️</text>
				</view>
				<!-- API测试按钮 (开发环境) -->
				<view class="test-api-btn" @tap="goToApiTest" v-if="showTestButton">
					<text class="test-text">🔧 API测试</text>
				</view>
				<text class="subtitle">调整你的口味偏好，获取个性化菜品推荐</text>
				<view class="date-info">
					<text class="date-text">{{ currentDate }}</text>
				</view>
				<view class="tags">
					<view class="tag tag-ai">🤖 AI智能推荐</view>
					<view class="tag tag-realtime">⚡ 实时更新</view>
					<view class="tag tag-personal">🎯 个性化定制</view>
				</view>
			</view>
		</view>

		<!-- Preset buttons section -->
		<view class="preset-section">
			<text class="section-title">🎯 快速预设配置</text>
			<view class="preset-row">
				<view 
					v-for="(preset, index) in presets" 
					:key="index"
					class="preset-icon-btn"
					@tap="selectPreset(preset)"
				>
					<text class="preset-emoji">{{ preset.emoji }}</text>
				</view>
				<view class="preset-icon-btn preset-random" @tap="randomRecommend">
					<text class="preset-emoji">🎲</text>
				</view>
			</view>
		</view>

		<!-- Ingredient search section -->
		<view class="search-section">
			<view class="search-card">
				<view class="search-header">
					<text class="search-emoji">🥬</text>
					<text class="search-title">食材搜索</text>
				</view>
				<view class="search-row">
					<view class="search-input-wrapper">
						<input 
							class="search-input" 
							placeholder="输入您有的食材..."
							v-model="searchTerm"
							@confirm="handleSearch"
						/>
						<view v-if="searchTerm" class="clear-btn" @tap="clearSearch">✕</view>
					</view>
					<button class="search-btn" @tap="handleSearch" :disabled="!searchTerm.trim()">
						<text v-if="isSearching">🔍</text>
						<text v-else>🔍</text>
					</button>
				</view>
				<text class="search-tip">💡 输入您现有的食材，我们为您推荐相关菜品</text>
			</view>
		</view>

		<!-- Food Radar Chart section -->
		<view class="radar-section">
			<text class="section-title">📊 口味雷达图</text>
			<view class="radar-container">
				<canvas 
					canvas-id="radarChart" 
					class="radar-canvas"
					@touchstart="onRadarTouch"
				></canvas>
				<view class="radar-legend">
					<view v-for="(pref, key) in preferences" :key="key" class="legend-item">
						<view class="legend-color" :style="{ backgroundColor: getRadarColor(key) }"></view>
						<text class="legend-label">{{ getPreferenceLabel(key) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Preferences control section -->
		<view class="preferences-section">
			<text class="section-title">🎛️ 口味偏好调节</text>
			<view class="preference-controls">
				<view v-for="(pref, key) in preferences" :key="key" class="preference-item">
					<view class="preference-header">
						<text class="preference-label">{{ getPreferenceLabel(key) }}</text>
						<text class="preference-value">{{ pref }}</text>
					</view>
					<slider 
						:value="pref" 
						:min="1" 
						:max="10" 
						:step="1"
						activeColor="#6366f1"
						backgroundColor="#e2e8f0"
						@change="updatePreference(key, $event)"
						class="compact-slider"
					/>
				</view>
			</view>
		</view>

		<!-- Recommended dishes section -->
		<view class="recommendations-section">
			<text class="section-title">🍳 为您推荐</text>
			<view v-if="loading" class="loading">
				<text>正在为您推荐美食...</text>
			</view>
			<view v-else class="dish-grid">
				<view 
					v-for="(dish, index) in recommendedDishes" 
					:key="dish.id"
					class="dish-card"
					@tap="viewDishDetail(dish)"
				>
					<view class="dish-header">
						<text class="dish-name">{{ dish.name }}</text>
						<view v-if="dish.matchScore" class="match-score">
							<text class="score-text">{{ Math.round(dish.matchScore) }}%匹配</text>
						</view>
					</view>
					<text class="dish-description">{{ dish.description }}</text>
					<view class="dish-meta">
						<text class="meta-item">⏱️ {{ dish.cookingTime }}</text>
						<text class="meta-item">📊 {{ dish.difficulty }}</text>
					</view>
					<view class="dish-tags">
						<text v-for="tag in dish.tags.slice(0, 3)" :key="tag" class="dish-tag">{{ tag }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../utils/api.js'
import { CONFIG } from '../../utils/config.js'

export default {
	data() {
		return {
			greeting: '早上好',
			meal: '早餐',
			currentDate: '',
			searchTerm: '',
			isSearching: false,
			loading: false,
			preferences: { ...CONFIG.DEFAULT_PREFERENCES },
			presets: CONFIG.PRESETS,
			recommendedDishes: [],
			showTestButton: true // 开发环境显示测试按钮
		}
	},
	onLoad() {
		this.initializeApp();
		this.fetchRecommendations();
	},
	onReady() {
		this.drawRadarChart();
	},
	methods: {
		initializeApp() {
			this.updateGreeting();
			this.updateDate();
		},
		updateGreeting() {
			const hour = new Date().getHours();
			if (hour < 10) {
				this.greeting = '早上好';
				this.meal = '早餐';
			} else if (hour >= 10 && hour < 16) {
				this.greeting = '中午好';
				this.meal = '午餐';
			} else {
				this.greeting = '晚上好';
				this.meal = '晚餐';
			}
		},
		updateDate() {
			const now = new Date();
			const options = { 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric',
				weekday: 'long'
			};
			this.currentDate = now.toLocaleDateString('zh-CN', options);
		},
		selectPreset(preset) {
			this.preferences = { ...preset.preferences };
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			uni.showToast({
				title: `已选择${preset.name}`,
				icon: 'success'
			});
		},
		randomRecommend() {
			this.preferences = {
				healthy: Math.floor(Math.random() * 10) + 1,
				difficulty: Math.floor(Math.random() * 3) + 1,
				vegetarian: Math.floor(Math.random() * 10) + 1,
				spicy: Math.floor(Math.random() * 10) + 1,
				sweetness: Math.floor(Math.random() * 10) + 1
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			uni.showToast({
				title: '随机推荐已生成',
				icon: 'success'
			});
		},
		handleSearch() {
			if (!this.searchTerm.trim()) return;
			
			this.isSearching = true;
			uni.setStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH, this.searchTerm.trim());
			
			setTimeout(() => {
				this.fetchRecommendations();
				this.isSearching = false;
				uni.showToast({
					title: '搜索完成',
					icon: 'success'
				});
			}, 1000);
		},
		clearSearch() {
			this.searchTerm = '';
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
		},
		updatePreference(key, event) {
			this.preferences[key] = event.detail.value;
			this.drawRadarChart(); // Redraw radar chart
			clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => {
				this.fetchRecommendations();
			}, 500);
		},
		getPreferenceLabel(key) {
			const labels = {
				healthy: '🥗 健康度',
				difficulty: '👨‍🍳 难易度',
				vegetarian: '🥬 素食度',
				spicy: '🌶️ 辣味度',
				sweetness: '🍯 甜味度'
			};
			return labels[key] || key;
		},
		async fetchRecommendations() {
			this.loading = true;
			
			try {
				const searchTerm = uni.getStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
				let recipes = [];
				
				if (searchTerm) {
					// 如果有搜索词，按食材搜索
					const searchResult = await api.searchRecipesByIngredients([searchTerm]);
					// 处理食材搜索的特殊响应格式
					recipes = searchResult.results || searchResult;
				} else {
					// 否则根据偏好推荐
					recipes = await api.getRecommendedRecipes(this.preferences);
				}
				
				// 转换数据格式并计算匹配分数
				this.recommendedDishes = recipes.map(recipe => {
					const dish = api.convertRecipeToDish(recipe);
					dish.matchScore = api.calculateMatchScore(dish, this.preferences);
					return dish;
				});
				
				// 按匹配分数排序
				this.recommendedDishes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
				
			} catch (error) {
				console.error('获取推荐失败:', error);
				api.handleApiError(error);
				
				// 失败时使用备用数据
				this.recommendedDishes = this.getFallbackDishes();
			} finally {
				this.loading = false;
			}
		},
		getFallbackDishes() {
			// 备用数据，当API失败时使用
			const fallbackDishes = [
				{
					id: 'fallback_1',
					name: '番茄鸡蛋面',
					description: '经典家常面条，酸甜可口，营养丰富',
					cookingTime: '15分钟',
					difficulty: '简单',
					tags: ['家常菜', '快手菜', '营养'],
					matchScore: 85,
					ingredients: ['番茄', '鸡蛋', '面条', '葱'],
					steps: ['准备食材', '炒制番茄鸡蛋', '煮面条', '调味装盘'],
					category: '家常菜',
					scores: { healthy: 7, difficulty: 1, vegetarian: 3, spicy: 2, sweetness: 4 }
				},
				{
					id: 'fallback_2',
					name: '蒜蓉西兰花',
					description: '简单素菜，清爽健康，富含维生素',
					cookingTime: '10分钟',
					difficulty: '简单',
					tags: ['素食', '健康', '快手菜'],
					matchScore: 88,
					ingredients: ['西兰花', '大蒜', '生抽', '盐'],
					steps: ['处理西兰花', '爆炒蒜蓉', '下西兰花炒制', '调味出锅'],
					category: '素食',
					scores: { healthy: 9, difficulty: 1, vegetarian: 10, spicy: 1, sweetness: 2 }
				}
			];
			
			const searchTerm = uni.getStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			if (searchTerm) {
				return fallbackDishes.filter(dish => 
					dish.ingredients.some(ingredient => ingredient.includes(searchTerm)) ||
					dish.name.includes(searchTerm)
				);
			}
			
			return fallbackDishes;
		},
		viewDishDetail(dish) {
			uni.navigateTo({
				url: `/pages/dish-detail/dish-detail?dish=${encodeURIComponent(JSON.stringify(dish))}`
			});
		},
		goToApiTest() {
			uni.navigateTo({
				url: '/pages/test-api/test-api'
			});
		},
		getRadarColor(key) {
			const colors = {
				healthy: '#10b981',
				difficulty: '#f59e0b',
				vegetarian: '#84cc16',
				spicy: '#ef4444',
				sweetness: '#8b5cf6'
			};
			return colors[key] || '#6366f1';
		},
		drawRadarChart() {
			const ctx = uni.createCanvasContext('radarChart', this);
			const centerX = 150;
			const centerY = 150;
			const radius = 100;
			const sides = Object.keys(this.preferences).length;
			
			// Clear canvas
			ctx.clearRect(0, 0, 300, 300);
			
			// Draw background grid
			ctx.setStrokeStyle('rgba(255, 255, 255, 0.25)');
			ctx.setLineWidth(1);
			
			// Draw concentric circles
			for (let i = 1; i <= 5; i++) {
				ctx.beginPath();
				ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
				ctx.stroke();
			}
			
			// Draw axis lines
			const angleStep = (2 * Math.PI) / sides;
			const labels = Object.keys(this.preferences);
			
			for (let i = 0; i < sides; i++) {
				const angle = i * angleStep - Math.PI / 2;
				const x = centerX + Math.cos(angle) * radius;
				const y = centerY + Math.sin(angle) * radius;
				
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
			
			// Draw data polygon
			ctx.setStrokeStyle('#6366f1');
			ctx.setFillStyle('rgba(99, 102, 241, 0.25)');
			ctx.setLineWidth(2);
			ctx.beginPath();
			
			for (let i = 0; i < sides; i++) {
				const angle = i * angleStep - Math.PI / 2;
				const value = this.preferences[labels[i]];
				const distance = (radius * value) / 10;
				const x = centerX + Math.cos(angle) * distance;
				const y = centerY + Math.sin(angle) * distance;
				
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			
			// Draw data points
			ctx.setFillStyle('#6366f1');
			for (let i = 0; i < sides; i++) {
				const angle = i * angleStep - Math.PI / 2;
				const value = this.preferences[labels[i]];
				const distance = (radius * value) / 10;
				const x = centerX + Math.cos(angle) * distance;
				const y = centerY + Math.sin(angle) * distance;
				
				ctx.beginPath();
				ctx.arc(x, y, 4, 0, 2 * Math.PI);
				ctx.fill();
			}
			
			ctx.draw();
		},
		onRadarTouch(e) {
			// Handle radar chart touch interactions if needed
			console.log('Radar chart touched', e);
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	position: relative;
}

.header {
	padding: 40rpx 30rpx;
	text-align: center;
}

.header-content {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: 30rpx;
	padding: 40rpx;
}

.greeting-section {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.emoji {
	font-size: 60rpx;
	margin: 0 20rpx;
}

.greeting-text {
	font-size: 48rpx;
	font-weight: bold;
	color: white;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}

.subtitle {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 20rpx;
}

.date-info {
	margin-bottom: 30rpx;
}

.date-text {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.tags {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20rpx;
}

.tag {
	padding: 10rpx 20rpx;
	border-radius: 50rpx;
	font-size: 22rpx;
	color: white;
}

.tag-ai {
	background: linear-gradient(45deg, #3b82f6, #06b6d4);
}

.tag-realtime {
	background: linear-gradient(45deg, #10b981, #84cc16);
}

.tag-personal {
	background: linear-gradient(45deg, #f59e0b, #ef4444);
}

.preset-section {
	padding: 0 30rpx 40rpx;
}

.section-title {
	display: block;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 30rpx;
}

.preset-row {
	display: flex;
	justify-content: space-around;
	align-items: center;
	gap: 20rpx;
	padding: 0 20rpx;
}

.preset-icon-btn {
	width: 80rpx;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.preset-icon-btn:active {
	transform: scale(0.9);
	background: rgba(255, 255, 255, 0.25);
}

.preset-emoji {
	font-size: 36rpx;
}

.preset-random {
	background: linear-gradient(45deg, #8b5cf6, #6366f1);
}

.search-section {
	padding: 0 30rpx 40rpx;
}

.search-card {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 25rpx;
	padding: 40rpx;
}

.search-header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 30rpx;
}

.search-emoji {
	font-size: 40rpx;
	margin-right: 15rpx;
}

.search-title {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
}

.search-row {
	display: flex;
	gap: 20rpx;
	align-items: center;
	margin-bottom: 20rpx;
}

.search-input-wrapper {
	position: relative;
	flex: 1;
}

.search-input {
	width: 100%;
	padding: 20rpx 25rpx;
	border-radius: 50rpx;
	background: rgba(255, 255, 255, 0.9);
	border: none;
	font-size: 26rpx;
	box-sizing: border-box;
}

.clear-btn {
	position: absolute;
	right: 25rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 35rpx;
	height: 35rpx;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: #666;
}

.search-btn {
	width: 80rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: linear-gradient(45deg, #10b981, #059669);
	color: white;
	border: none;
	font-size: 24rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-btn[disabled] {
	opacity: 0.5;
}

.search-tip {
	text-align: center;
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
}

.radar-section {
	padding: 0 30rpx 40rpx;
}

.radar-container {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 25rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.radar-canvas {
	width: 300rpx;
	height: 300rpx;
	margin-bottom: 30rpx;
}

.radar-legend {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 20rpx;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.legend-color {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
}

.legend-label {
	font-size: 22rpx;
	color: white;
}

.preferences-section {
	padding: 0 30rpx 40rpx;
}

.preference-controls {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 25rpx;
	padding: 40rpx;
}

.preference-item {
	margin-bottom: 25rpx;
}

.preference-item:last-child {
	margin-bottom: 0;
}

.preference-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.preference-label {
	font-size: 24rpx;
	color: white;
	font-weight: bold;
}

.preference-value {
	font-size: 24rpx;
	color: #fbbf24;
	font-weight: bold;
	background: rgba(251, 191, 36, 0.2);
	padding: 3rpx 12rpx;
	border-radius: 12rpx;
}

.compact-slider {
	transform: scale(0.8);
	transform-origin: left center;
}

.recommendations-section {
	padding: 0 30rpx 60rpx;
}

.loading {
	text-align: center;
	padding: 80rpx;
	color: white;
	font-size: 28rpx;
}

.dish-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 25rpx;
}

.dish-card {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 25rpx;
	padding: 35rpx;
	transition: all 0.3s ease;
}

.dish-card:active {
	transform: scale(0.98);
	background: rgba(255, 255, 255, 0.25);
}

.dish-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.dish-name {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
}

.match-score {
	background: linear-gradient(45deg, #10b981, #059669);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.score-text {
	font-size: 22rpx;
	color: white;
	font-weight: bold;
}

.dish-description {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 20rpx;
	line-height: 1.4;
}

.dish-meta {
	display: flex;
	gap: 30rpx;
	margin-bottom: 20rpx;
}

.meta-item {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.dish-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.dish-tag {
	padding: 8rpx 16rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 15rpx;
	font-size: 22rpx;
	color: white;
}

.test-api-btn {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(10px);
	border-radius: 15rpx;
	padding: 10rpx 20rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.test-text {
	font-size: 24rpx;
	color: white;
	font-weight: bold;
}
</style>