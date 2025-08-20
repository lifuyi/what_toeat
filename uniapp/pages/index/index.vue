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
		</view>

		<!-- Food Radar Chart section -->
		<view class="radar-section">
			<text class="section-title">📊 口味雷达图</text>
			<view class="radar-container">
				<canvas 
					type="2d"
					id="radarChart"
					class="radar-canvas"
					:style="{ width: '300rpx', height: '300rpx' }"
					@touchstart="onRadarTouch"
					@touchmove="onRadarTouchMove"
					@touchend="onRadarTouchEnd"
				></canvas>
				<text class="debug-info">🎯 拖拽雷达图上的点来调整偏好值 (已移除滑块控制)</text>
				<view class="radar-legend">
					<view v-for="(pref, key) in preferences" :key="key" class="legend-item">
						<view class="legend-color" :style="{ backgroundColor: getRadarColor(key) }"></view>
						<text class="legend-label">{{ getPreferenceLabel(key) }}</text>
					</view>
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
					<!-- Line 1: Title with match score -->
					<view class="dish-header">
						<text class="dish-name">{{ dish.name }}</text>
						<view v-if="dish.matchScore" class="match-score">
							<text class="score-text">{{ Math.round(dish.matchScore) }}%匹配</text>
						</view>
					</view>
					
					<!-- Line 2: Description -->
					<text class="dish-description">{{ dish.description }}</text>
					
					<!-- Line 3: Time and Difficulty -->
					<view class="dish-meta">
						<text class="meta-item">⏱️ {{ dish.cookingTime }}</text>
						<text class="meta-item">📊 {{ dish.difficulty }}</text>
					</view>
					
					<!-- Line 4: CID from database -->
					<view class="dish-cid">
						<text class="cid-label">{{ dish.cid || dish.category || '未分类' }}</text>
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
			showTestButton: true, // 开发环境显示测试按钮
			isDragging: false,
			draggedPoint: null,
			debounceTimer: null
		}
	},
	onLoad() {
		this.initializeApp();
		this.fetchRecommendations();
	},
	onReady() {
		console.log('Page ready, drawing radar chart...');
		console.log('Preferences:', this.preferences);
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
				console.log('Raw API recipes:', recipes);
				this.recommendedDishes = recipes.map(recipe => {
					console.log('Converting recipe:', recipe);
					const dish = api.convertRecipeToDish(recipe);
					console.log('Converted dish:', dish);
					dish.matchScore = api.calculateMatchScore(dish, this.preferences);
					return dish;
				});
				console.log('Final recommended dishes:', this.recommendedDishes);
				
				// 按匹配分数排序
				this.recommendedDishes.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
				
			} catch (error) {
				console.error('获取推荐失败:', error);
				api.handleApiError(error);
				
				// 显示错误信息，不使用备用数据，这样可以看到真实的API问题
				uni.showToast({
					title: 'API连接失败，请检查网络',
					icon: 'error',
					duration: 3000
				});
				this.recommendedDishes = [];
			} finally {
				this.loading = false;
			}
		},
		getFallbackDishes() {
			// 备用数据，当API失败时使用
			const fallbackDishes = [
				{
					id: 'fallback_1',
					cid: 'CID001234',
					name: '番茄鸡蛋面',
					description: '经典家常面条，酸甜可口，营养丰富，老少皆宜的传统美食',
					cookingTime: '15分钟',
					difficulty: '简单',
					tags: ['小吃', '家常菜', '快手菜', '营养', '面食'],
					matchScore: 85,
					ingredients: ['番茄', '鸡蛋', '面条', '葱'],
					steps: ['准备食材', '炒制番茄鸡蛋', '煮面条', '调味装盘'],
					category: '家常菜',
					scores: { healthy: 7, difficulty: 1, vegetarian: 3, spicy: 2, sweetness: 4 }
				},
				{
					id: 'fallback_2',
					cid: 'CID005678',
					name: '蒜蓉西兰花',
					description: '简单素菜，清爽健康，富含维生素C和膳食纤维，口感脆嫩',
					cookingTime: '10分钟',
					difficulty: '简单',
					tags: ['素食', '健康', '快手菜', '蔬菜', '清淡'],
					matchScore: 88,
					ingredients: ['西兰花', '大蒜', '生抽', '盐'],
					steps: ['处理西兰花', '爆炒蒜蓉', '下西兰花炒制', '调味出锅'],
					category: '素食',
					scores: { healthy: 9, difficulty: 1, vegetarian: 10, spicy: 1, sweetness: 2 }
				},
				{
					id: 'fallback_3',
					cid: 'CID009876',
					name: '宫保鸡丁',
					description: '四川经典菜品，鸡肉嫩滑，花生香脆，酸甜微辣，下饭神器',
					cookingTime: '25分钟',
					difficulty: '中等',
					tags: ['川菜', '下饭菜', '经典', '辣味', '荤菜'],
					matchScore: 92,
					ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒'],
					steps: ['腌制鸡肉', '炸花生米', '爆炒调味', '装盘上桌'],
					category: '川菜',
					scores: { healthy: 6, difficulty: 2, vegetarian: 2, spicy: 8, sweetness: 5 }
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
			// Add a small delay to ensure canvas is ready
			this.$nextTick(() => {
				setTimeout(() => {
					this.renderRadarChart();
				}, 200); // Increased delay
			});
		},
		
		async renderRadarChart() {
			console.log('Starting Canvas 2D radar chart render...');
			
			try {
				// Use Canvas 2D API (modern approach)
				const query = uni.createSelectorQuery().in(this);
				const canvas = await new Promise((resolve) => {
					query.select('#radarChart').fields({ node: true, size: true }).exec((res) => {
						resolve(res[0]);
					});
				});
				
				if (!canvas || !canvas.node) {
					console.error('Failed to get canvas node');
					return;
				}
				
				const ctx = canvas.node.getContext('2d');
				const dpr = uni.getSystemInfoSync().pixelRatio;
				
				// Set canvas size
				canvas.node.width = canvas.width * dpr;
				canvas.node.height = canvas.height * dpr;
				ctx.scale(dpr, dpr);
				
				console.log('Canvas 2D context created successfully', { width: canvas.width, height: canvas.height, dpr });
				
				// Use proper dimensions
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				const centerX = canvasWidth / 2;
				const centerY = canvasHeight / 2;
				const radius = Math.min(canvasWidth, canvasHeight) * 0.25; // 25% of canvas size
				const sides = Object.keys(this.preferences).length;
				
				// Clear canvas with white background
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, canvasWidth, canvasHeight);
				
				// Draw background grid
				ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
				ctx.lineWidth = 1;
				
				// Draw concentric circles
				for (let i = 1; i <= 5; i++) {
					ctx.beginPath();
					ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
					ctx.stroke();
				}
				
				// Draw axis lines and labels
				const angleStep = (2 * Math.PI) / sides;
				const labels = Object.keys(this.preferences);
				const labelNames = {
					healthy: '健康',
					difficulty: '难度',
					vegetarian: '素食',
					spicy: '辣味',
					sweetness: '甜味'
				};
				
				ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
				ctx.fillStyle = '#666666';
				ctx.font = '12px Arial';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				
				for (let i = 0; i < sides; i++) {
					const angle = i * angleStep - Math.PI / 2;
					const x = centerX + Math.cos(angle) * radius;
					const y = centerY + Math.sin(angle) * radius;
					
					// Draw axis line
					ctx.beginPath();
					ctx.moveTo(centerX, centerY);
					ctx.lineTo(x, y);
					ctx.stroke();
					
					// Draw label
					const labelX = centerX + Math.cos(angle) * (radius + 20);
					const labelY = centerY + Math.sin(angle) * (radius + 20);
					ctx.fillText(labelNames[labels[i]] || labels[i], labelX, labelY);
				}
				
				// Draw data polygon
				ctx.strokeStyle = '#6366f1';
				ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
				ctx.lineWidth = 2;
				ctx.beginPath();
				
				for (let i = 0; i < sides; i++) {
					const angle = i * angleStep - Math.PI / 2;
					const value = this.preferences[labels[i]] || 1;
					const distance = (radius * Math.max(1, Math.min(10, value))) / 10;
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
				
				// Draw data points with enhanced interactivity
				for (let i = 0; i < sides; i++) {
					const angle = i * angleStep - Math.PI / 2;
					const value = this.preferences[labels[i]] || 1;
					const distance = (radius * Math.max(1, Math.min(10, value))) / 10;
					const x = centerX + Math.cos(angle) * distance;
					const y = centerY + Math.sin(angle) * distance;
					
					// Draw outer ring for better touch target
					ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
					ctx.beginPath();
					ctx.arc(x, y, 8, 0, 2 * Math.PI);
					ctx.fill();
					
					// Draw main point
					ctx.fillStyle = '#6366f1';
					ctx.beginPath();
					ctx.arc(x, y, 5, 0, 2 * Math.PI);
					ctx.fill();
					
					// Draw white center for contrast
					ctx.fillStyle = '#ffffff';
					ctx.beginPath();
					ctx.arc(x, y, 2, 0, 2 * Math.PI);
					ctx.fill();
					
					// Draw value text with background
					ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
					ctx.fillRect(x - 8, y - 18, 16, 12);
					ctx.strokeStyle = '#6366f1';
					ctx.lineWidth = 1;
					ctx.strokeRect(x - 8, y - 18, 16, 12);
					
					ctx.fillStyle = '#333333';
					ctx.font = 'bold 10px Arial';
					ctx.textAlign = 'center';
					ctx.fillText(value.toString(), x, y - 10);
				}
				
				console.log('Canvas 2D radar chart completed successfully');
				
			} catch (error) {
				console.error('Canvas 2D rendering failed:', error);
				// Fallback to old method if Canvas 2D is not supported
				this.renderRadarChartFallback();
			}
		},
		
		renderRadarChartFallback() {
			console.log('Using fallback canvas rendering...');
			const ctx = uni.createCanvasContext('radarChart', this);
			if (!ctx) {
				console.error('Failed to create fallback canvas context');
				return;
			}
			
			// Use conservative dimensions for fallback
			const canvasSize = 300;
			const centerX = 150;
			const centerY = 150;
			const radius = 60;
			const sides = Object.keys(this.preferences).length;
			
			// Clear canvas
			ctx.setFillStyle('#ffffff');
			ctx.fillRect(0, 0, canvasSize, canvasSize);
			
			// Draw background grid
			ctx.setStrokeStyle('rgba(99, 102, 241, 0.2)');
			ctx.setLineWidth(1);
			
			for (let i = 1; i <= 5; i++) {
				ctx.beginPath();
				ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
				ctx.stroke();
			}
			
			// Draw axis lines
			const angleStep = (2 * Math.PI) / sides;
			const labels = Object.keys(this.preferences);
			
			ctx.setStrokeStyle('rgba(99, 102, 241, 0.3)');
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
			ctx.setFillStyle('rgba(99, 102, 241, 0.3)');
			ctx.setLineWidth(2);
			ctx.beginPath();
			
			for (let i = 0; i < sides; i++) {
				const angle = i * angleStep - Math.PI / 2;
				const value = this.preferences[labels[i]] || 1;
				const distance = (radius * Math.max(1, Math.min(10, value))) / 10;
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
				const value = this.preferences[labels[i]] || 1;
				const distance = (radius * Math.max(1, Math.min(10, value))) / 10;
				const x = centerX + Math.cos(angle) * distance;
				const y = centerY + Math.sin(angle) * distance;
				
				ctx.beginPath();
				ctx.arc(x, y, 4, 0, 2 * Math.PI);
				ctx.fill();
			}
			
			ctx.draw(true);
			console.log('Fallback radar chart completed');
		},
		
		onRadarTouch(e) {
			this.handleRadarInteraction(e);
		},
		
		onRadarTouchMove(e) {
			this.handleRadarInteraction(e);
		},
		
		onRadarTouchEnd(e) {
			this.isDragging = false;
			this.draggedPoint = null;
		},
		
		handleRadarInteraction(e) {
			if (!e.touches || e.touches.length === 0) return;
			
			const touch = e.touches[0];
			
			// Get canvas position and size
			uni.createSelectorQuery().in(this).select('#radarChart').boundingClientRect((rect) => {
				if (!rect) return;
				
				// Calculate relative position within canvas
				const relativeX = touch.clientX - rect.left;
				const relativeY = touch.clientY - rect.top;
				
				// Convert to canvas coordinates (accounting for rpx to px conversion)
				const canvasX = (relativeX / rect.width) * 300;
				const canvasY = (relativeY / rect.height) * 300;
				
				this.updatePreferenceFromTouch(canvasX, canvasY);
			}).exec();
		},
		
		updatePreferenceFromTouch(canvasX, canvasY) {
			const centerX = 150;
			const centerY = 150;
			const maxRadius = 75; // Maximum radius for preferences
			
			// Calculate distance from center
			const deltaX = canvasX - centerX;
			const deltaY = canvasY - centerY;
			const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			
			// Calculate angle
			let angle = Math.atan2(deltaY, deltaX) + Math.PI / 2;
			if (angle < 0) angle += 2 * Math.PI;
			
			// Determine which preference dimension this corresponds to
			const sides = Object.keys(this.preferences).length;
			const angleStep = (2 * Math.PI) / sides;
			const labels = Object.keys(this.preferences);
			
			// Find the closest preference dimension
			let closestIndex = 0;
			let minAngleDiff = Math.PI;
			
			for (let i = 0; i < sides; i++) {
				const preferenceAngle = i * angleStep;
				let angleDiff = Math.abs(angle - preferenceAngle);
				if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
				
				if (angleDiff < minAngleDiff) {
					minAngleDiff = angleDiff;
					closestIndex = i;
				}
			}
			
			// Only update if touch is close enough to a preference axis (within 30 degrees)
			if (minAngleDiff < Math.PI / 6) {
				const preferenceKey = labels[closestIndex];
				
				// Calculate new value based on distance from center
				const clampedDistance = Math.min(distance, maxRadius);
				const newValue = Math.max(1, Math.min(10, Math.round((clampedDistance / maxRadius) * 10)));
				
				// Update preference if it changed
				if (this.preferences[preferenceKey] !== newValue) {
					this.preferences[preferenceKey] = newValue;
					this.drawRadarChart();
					
					// Debounced API call
					clearTimeout(this.debounceTimer);
					this.debounceTimer = setTimeout(() => {
						this.fetchRecommendations();
					}, 500);
					
					// Show feedback
					uni.showToast({
						title: `${this.getPreferenceLabel(preferenceKey).split(' ')[1]}: ${newValue}`,
						icon: 'none',
						duration: 1000
					});
				}
			}
		},
		
		getFirstThreeTags(tags) {
			if (!tags || !Array.isArray(tags)) return '';
			return tags.slice(0, 3).join('\r\n');
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
	font-size: 36rpx;
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
	padding: 0 25rpx;
	border-radius: 50rpx;
	background: rgba(255, 255, 255, 0.9);
	border: none;
	font-size: 28rpx;
	box-sizing: border-box;
	height: 68rpx;
	line-height: 68rpx;
	text-align: left;
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
	width: 68rpx;
	height: 68rpx;
	border-radius: 34rpx;
	background: linear-gradient(45deg, #10b981, #059669);
	color: white;
	border: none;
	font-size: 26rpx;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-btn[disabled] {
	opacity: 0.5;
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
	width: 300rpx !important;
	height: 300rpx !important;
	margin-bottom: 30rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 15rpx;
	border: 2rpx solid rgba(99, 102, 241, 0.2);
	display: block;
	box-sizing: border-box;
	cursor: pointer;
	touch-action: none; /* Prevent scrolling while dragging */
}

.debug-info {
	font-size: 24rpx;
	color: #666;
	text-align: center;
	margin-bottom: 10rpx;
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

.dish-cid {
	margin-top: 15rpx;
	padding-top: 10rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.cid-label {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.7);
	font-family: 'Courier New', monospace;
	font-weight: normal;
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