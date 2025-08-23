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

		<!-- Radar and Presets Combined Section -->
		<view class="radar-preset-section">
			<text class="section-title">📊 口味偏好设置</text>
			<view class="radar-preset-card">
				<canvas 
					type="2d"
					id="radarChart"
					class="radar-canvas"
					:style="{ width: '300rpx', height: '300rpx' }"
					@touchstart="onRadarTouch"
					@touchmove="onRadarTouchMove"
					@touchend="onRadarTouchEnd"
				></canvas>
				
				<view class="preset-buttons-area">
					<text class="preset-subtitle">🎯 快速预设配置</text>
					<view class="preset-grid">
						<view 
							class="preset-btn preset-healthy"
							@tap="selectHealthyPreset"
						>
							<text class="preset-emoji">🥗</text>
						</view>
						<view 
							class="preset-btn preset-easy"
							@tap="selectEasyPreset"
						>
							<text class="preset-emoji">⚡</text>
						</view>
						<view 
							class="preset-btn preset-vegetarian"
							@tap="selectVegetarianPreset"
						>
							<text class="preset-emoji">🥬</text>
						</view>
						<view 
							class="preset-btn preset-spicy"
							@tap="selectSpicyPreset"
						>
							<text class="preset-emoji">🌶️</text>
						</view>
						<view 
							class="preset-btn preset-gourmet"
							@tap="selectGourmetPreset"
						>
							<text class="preset-emoji">👨‍🍳</text>
						</view>
						<view 
							class="preset-btn preset-balanced"
							@tap="selectBalancedPreset"
						>
							<text class="preset-emoji">⚖️</text>
						</view>
						<view class="preset-btn preset-random" @tap="randomRecommend">
							<text class="preset-emoji">🎲</text>
						</view>
					</view>
					<text class="preset-subtitle">🔍 食材搜索</text>
					<view class="search-row">
						<view class="search-input-wrapper">
							<input 
								class="search-input" 
								placeholder="输入您有的食材..."
								v-model="searchTerm"
								@confirm="handleSearch"
							/>
							<view v-if="searchTerm" class="clear-btn" @tap="clearSearch">✕</view>
							<button class="search-btn-inline" @tap="handleSearch" :disabled="!searchTerm.trim()">
								<text v-if="isSearching">🔍</text>
								<text v-else>🔍</text>
							</button>
						</view>
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
					:class="{ 'high-match': dish.matchScore >= 80, 'medium-match': dish.matchScore >= 60 && dish.matchScore < 80 }"
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
					<text class="dish-description">{{ dish.description || '美味当家，点击查看详细做法...' }}</text>
					
					<!-- Line 3: Time and Difficulty -->
					<view class="dish-meta">
						<text class="meta-item">⏱️ {{ dish.cookingTime }}</text>
						<text class="meta-item">📊 {{ dish.difficulty }}</text>
					</view>
					
					<!-- Line 4: CID tags from database -->
					<view class="dish-cid-tags" v-if="dish.cid">
						<text v-for="(cidTag, index) in splitCidTags(dish.cid)" :key="index" class="cid-tag">{{ cidTag }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- Favorites section -->
		<!-- Favorites section -->
		<view class="favorites-section">
			<view class="section-header">
				<text class="section-title">❤️ 我的收藏</text>
				<view class="refresh-btn" @tap="loadFavorites">
					<text class="refresh-text">🔄</text>
				</view>
			</view>
			<view v-if="favoriteDishes.length > 0" class="dish-grid">
				<view 
					v-for="(dish, index) in favoriteDishes" 
					:key="dish.id"
					class="dish-card favorite-card"
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
					<text class="dish-description">{{ dish.description || '美味当家，点击查看详细做法...' }}</text>
					
					<!-- Line 3: Time and Difficulty -->
					<view class="dish-meta">
						<text class="meta-item">⏱️ {{ dish.cookingTime }}</text>
						<text class="meta-item">📊 {{ dish.difficulty }}</text>
					</view>
				</view>
			</view>
			<view v-else class="no-favorites">
				<text class="no-favorites-text">还没有收藏的菜品，快去发现你喜欢的美食吧！</text>
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
			favoriteDishes: [],
			showTestButton: true, // 开发环境显示测试按钮
			isDragging: false,
			draggedPoint: null,
			debounceTimer: null
		}
	},
	onLoad() {
		this.initializeApp();
		this.loadFavorites();
		this.fetchRecommendations();
		
		// 监听收藏更新事件
		uni.$on('favoritesUpdated', () => {
			this.loadFavorites();
		});
	},
	onReady() {
		console.log('Page ready, drawing radar chart...');
		console.log('Preferences:', this.preferences);
		this.drawRadarChart();
	},
	onUnload() {
		// 移除事件监听器
		uni.$off('favoritesUpdated');
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
		loadFavorites() {
			try {
				const favorites = uni.getStorageSync(CONFIG.STORAGE_KEYS.FAVORITES) || [];
				const searchTerm = uni.getStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
				
				// 如果有搜索词，过滤收藏列表
				if (searchTerm) {
					this.favoriteDishes = favorites.filter(dish => 
						dish.ingredients.some(ingredient => ingredient.includes(searchTerm)) ||
						dish.name.includes(searchTerm)
					);
				} else {
					this.favoriteDishes = favorites;
				}
				
				uni.showToast({
					title: '收藏列表已更新',
					icon: 'success',
					duration: 1000
				});
			} catch (e) {
				console.error('Failed to load favorites:', e);
				this.favoriteDishes = [];
				uni.showToast({
					title: '加载收藏失败',
					icon: 'error',
					duration: 1000
				});
			}
		},
		selectHealthyPreset() {
			this.preferences = {
				healthy: 10,
				difficulty: 1,
				vegetarian: 8,
				spicy: 2,
				sweetness: 3
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择健康达人模式',
				icon: 'success'
			});
		},
		selectSpicyPreset() {
			this.preferences = {
				healthy: 4,
				difficulty: 3,
				vegetarian: 3,
				spicy: 10,
				sweetness: 2
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择重口味模式',
				icon: 'success'
			});
		},
		selectEasyPreset() {
			this.preferences = {
				healthy: 6,
				difficulty: 1,
				vegetarian: 5,
				spicy: 4,
				sweetness: 5
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择简单易做模式',
				icon: 'success'
			});
		},
		selectVegetarianPreset() {
			this.preferences = {
				healthy: 9,
				difficulty: 2,
				vegetarian: 10,
				spicy: 3,
				sweetness: 4
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择素食主义模式',
				icon: 'success'
			});
		},
		selectGourmetPreset() {
			this.preferences = {
				healthy: 7,
				difficulty: 3,
				vegetarian: 4,
				spicy: 5,
				sweetness: 6
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择精致烹饪模式',
				icon: 'success'
			});
		},
		selectBalancedPreset() {
			this.preferences = {
				healthy: 5,
				difficulty: 2,
				vegetarian: 5,
				spicy: 5,
				sweetness: 5
			};
			uni.removeStorageSync(CONFIG.STORAGE_KEYS.INGREDIENT_SEARCH);
			this.fetchRecommendations();
			this.loadFavorites();
			this.drawRadarChart();
			uni.showToast({
				title: '已选择均衡口味模式',
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
			this.loadFavorites();
			this.drawRadarChart();
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
				this.loadFavorites(); // 更新收藏列表
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
			this.loadFavorites(); // 更新收藏列表
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
				
				// 更新收藏列表
				this.loadFavorites();
				
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
		},
		
		// Split CID string by comma and trim whitespace
		splitCidTags(cidString) {
			if (!cidString) return [];
			return cidString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #ffffff;
	position: relative;
}

.header {
	padding: 40rpx 30rpx;
	text-align: center;
}

.header-content {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 30rpx;
	padding: 40rpx;
	box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
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

.search-section {
	padding: 30rpx;
	background: linear-gradient(135deg, #10b981, #84cc16);
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(16, 185, 129, 0.3);
}

.section-title {
	display: block;
	text-align: center;
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 30rpx;
}

.section-subtitle {
	display: block;
	text-align: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #475569;
	margin-bottom: 20rpx;
}

.divider {
	height: 2rpx;
	background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
	margin: 30rpx 0;
}

.preset-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 10rpx;
	padding: 0 20rpx;
}

.preset-btn {
	background: linear-gradient(135deg, #fbbf24 40%, #f59e0b);
	border: 2rpx solid #f59e0b;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 12rpx rgba(245, 158, 11, 0.3);
	padding: 20rpx 10rpx;
	height: 40rpx; 
	width: 50rpx;
}

.preset-btn:active {
	transform: scale(0.95);
	background: linear-gradient(135deg, #f59e0b, #d97706);
	border-color: #d97706;
	box-shadow: 0 2rpx 8rpx rgba(217, 119, 6, 0.4);
}

.preset-emoji {
	font-size: 36rpx;
	/*margin-bottom: 10rpx;
	animation: bounce 1s ease-in-out infinite;*/
}

.preset-name {
	font-size: 24rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 5rpx;
}

.preset-desc {
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.9);
	text-align: center;
	line-height: 1.2;
}



.preset-healthy {
	background: linear-gradient(135deg, #10b981 40%, #059669);
	border: 2rpx solid #059669;
}

.preset-healthy:active {
	background: linear-gradient(135deg, #059669, #047857);
	border-color: #047857;
}

.preset-easy {
	background: linear-gradient(135deg, #fbbf24 40%, #f59e0b);
	border: 2rpx solid #f59e0b;
}

.preset-easy:active {
	background: linear-gradient(135deg, #f59e0b, #d97706);
	border-color: #d97706;
}

.preset-vegetarian {
	background: linear-gradient(135deg, #84cc16 40%, #65a30d);
	border: 2rpx solid #65a30d;
}

.preset-vegetarian:active {
	background: linear-gradient(135deg, #65a30d, #4d7c0f);
	border-color: #4d7c0f;
}

.preset-spicy {
	background: linear-gradient(135deg, #ef4444 40%, #dc2626);
	border: 2rpx solid #dc2626;
}

.preset-spicy:active {
	background: linear-gradient(135deg, #dc2626, #b91c1c);
	border-color: #b91c1c;
}

.preset-gourmet {
	background: linear-gradient(135deg, #8b5cf6 40%, #7c3aed);
	border: 2rpx solid #7c3aed;
}

.preset-gourmet:active {
	background: linear-gradient(135deg, #7c3aed, #6d28d9);
	border-color: #6d28d9;
}

.preset-balanced {
	background: linear-gradient(135deg, #0ea5e9 40%, #0284c7);
	border: 2rpx solid #0284c7;
}

.preset-balanced:active {
	background: linear-gradient(135deg, #0284c7, #0369a1);
	border-color: #0369a1;
}

.preset-random {
	background: linear-gradient(135deg, #8b5cf6 40%, #7c3aed);
	border: 2rpx solid #7c3aed;
}

.preset-random:active {
	background: linear-gradient(135deg, #7c3aed, #6d28d9);
	border-color: #6d28d9;
}



.search-row {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.search-input-wrapper {
	position: relative;
	flex: 1;
	display: flex;
	align-items: center;
}

.search-input {
	flex: 1;
	padding: 0 25rpx 0 25rpx;
	padding-right: 120rpx;
	border-radius: 50rpx;
	background: #ffffff;
	border: 2rpx solid #e2e8f0;
	font-size: 28rpx;
	box-sizing: border-box;
	height: 68rpx;
	line-height: 68rpx;
	text-align: left;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.clear-btn {
	position: absolute;
	right: 80rpx;
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

.search-btn-inline {
	position: absolute;
	right: 8rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 52rpx;
	height: 52rpx;
	border-radius: 26rpx;
	background: linear-gradient(45deg, #10b981, #059669);
	color: white;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.3);
}

.search-btn-inline:disabled {
	background: #d1d5db;
	box-shadow: none;
}

.search-btn-inline:active:not(:disabled) {
	transform: translateY(-50%) scale(0.95);
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


.radar-preset-section {
	padding: 30rpx;
	background: linear-gradient(135deg, #84cc16 40%, #10b981 100%);
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(245, 158, 11, 0.3);
}

.radar-preset-card {
	background: white;
	border-radius: 25rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
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

.preset-buttons-area {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.preset-subtitle {
	font-size: 24rpx;
	font-weight: 600;
	color: #065f46;
	margin-bottom: 10rpx;
	margin-top: 5rpx;
	text-align: center;
}



.recommendations-section {
	padding: 30rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	margin: 20rpx 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.loading {
	text-align: center;
	padding: 80rpx;
	color: white;
	font-size: 28rpx;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.loading::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
	border-top: 4rpx solid white;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-top: -40rpx;
}

.loading::after {
	content: '🍳';
	font-size: 40rpx;
	margin-bottom: 20rpx;
	animation: bounce 0.8s ease-in-out infinite alternate;
}

@keyframes spin {
	0% { transform: translate(-50%, -50%) rotate(0deg); }
	100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes bounce {
	0% { transform: translateY(0); }
	100% { transform: translateY(-15rpx); }
}

.dish-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 25rpx;
	animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.dish-card {
	animation: slideInCard 0.5s ease-out forwards;
	opacity: 0;
	border-radius: 25rpx;
	padding: 0;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.1), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	margin-bottom: 25rpx;
	position: relative;
	overflow: hidden;
	border: 2rpx solid rgba(255, 255, 255, 0.5);
	transform: translateY(0);
	display: flex;
	flex-direction: column;
	min-height: 280rpx;
	contain: layout style;
	cursor: pointer;
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.dish-card:nth-child(1) { animation-delay: 0.1s; }
.dish-card:nth-child(2) { animation-delay: 0.2s; }
.dish-card:nth-child(3) { animation-delay: 0.3s; }
.dish-card:nth-child(4) { animation-delay: 0.4s; }
.dish-card:nth-child(5) { animation-delay: 0.5s; }
.dish-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes slideInCard {
	from {
		opacity: 0;
		transform: translateY(50rpx) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.dish-card:hover {
	transform: translateY(-5rpx);
	box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.15), 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	/* Add glow effect on hover */
	filter: drop-shadow(0 0 15rpx rgba(99, 102, 241, 0.3));
}

.dish-card:active {
	transform: translateY(-2rpx);
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.18), 0 5rpx 15rpx rgba(0, 0, 0, 0.12);
	background: linear-gradient(135deg, #f0f2f5 0%, #f8f9fa 100%);
	/* Enhance active state */
	filter: drop-shadow(0 0 20rpx rgba(99, 102, 241, 0.5));
}

/* Colorful gradient backgrounds for different cards with enhanced styling */
.dish-card:nth-child(6n+1) {
	background: linear-gradient(135deg, rgba(255, 235, 156, 0.95) 0%, rgba(255, 215, 75, 0.95) 50%, rgba(255, 180, 0, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(255, 180, 0, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(255, 180, 0, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(255, 180, 0, 0.3));
}

.dish-card:nth-child(6n+2) {
	background: linear-gradient(135deg, rgba(209, 196, 255, 0.95) 0%, rgba(162, 128, 255, 0.95) 50%, rgba(125, 75, 255, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(162, 128, 255, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(162, 128, 255, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(162, 128, 255, 0.3));
}

.dish-card:nth-child(6n+3) {
	background: linear-gradient(135deg, rgba(255, 185, 215, 0.95) 0%, rgba(255, 125, 180, 0.95) 50%, rgba(255, 75, 150, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(255, 125, 180, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(255, 125, 180, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(255, 125, 180, 0.3));
}

.dish-card:nth-child(6n+4) {
	background: linear-gradient(135deg, rgba(165, 255, 205, 0.95) 0%, rgba(75, 240, 175, 0.95) 50%, rgba(0, 220, 150, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(75, 240, 175, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(75, 240, 175, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(75, 240, 175, 0.3));
}

.dish-card:nth-child(6n+5) {
	background: linear-gradient(135deg, rgba(175, 225, 255, 0.95) 0%, rgba(100, 190, 255, 0.95) 50%, rgba(50, 160, 255, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(100, 190, 255, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(100, 190, 255, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(100, 190, 255, 0.3));
}

.dish-card:nth-child(6n+6) {
	background: linear-gradient(135deg, rgba(255, 195, 195, 0.95) 0%, rgba(255, 135, 135, 0.95) 50%, rgba(255, 95, 95, 0.95) 100%);
	box-shadow: 0 10rpx 25rpx rgba(255, 135, 135, 0.2), 0 5rpx 10rpx rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(255, 135, 135, 0.3);
	/* Add glow effect */
	filter: drop-shadow(0 0 15rpx rgba(255, 135, 135, 0.3));
}

.dish-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
	position: relative;
	z-index: 1;
	min-height: 50rpx;
	gap: 15rpx;
	padding: 30rpx 30rpx 0 30rpx;
}

.dish-header::after {
	content: '';
	position: absolute;
	bottom: -10rpx;
	left: 0;
	width: 60rpx;
	height: 4rpx;
	background: linear-gradient(90deg, #6366f1, #8b5cf6);
	border-radius: 2rpx;
	z-index: -1;
}

.dish-name {
	font-size: 36rpx;
	font-weight: 800;
	color: #0f172a;
	letter-spacing: 0.5rpx;
	line-height: 1.3;
	flex: 1;
	margin-right: 15rpx;
	word-break: break-word;
	background: linear-gradient(90deg, #6366f1, #8b5cf6);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	/* Add text shadow for better readability */
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.match-score {
	background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%);
	padding: 12rpx 20rpx;
	border-radius: 30rpx;
	box-shadow: 0 6rpx 15rpx rgba(16, 185, 129, 0.5);
	position: relative;
	overflow: hidden;
	align-self: flex-start;
	min-width: 130rpx;
	text-align: center;
	z-index: 1;
	transform: scale(1);
	transition: all 0.3s ease;
	animation: pulse 2s infinite;
	/* Add border for better visibility */
	border: 2rpx solid rgba(255, 255, 255, 0.5);
}

.match-score:hover {
	transform: scale(1.05);
}

.match-score::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
	animation: shimmer 2s infinite;
	z-index: -1;
}

@keyframes shimmer {
	0% { left: -100%; }
	100% { left: 100%; }
}

@keyframes pulse {
	0% { transform: scale(1); box-shadow: 0 6rpx 15rpx rgba(16, 185, 129, 0.5); }
	50% { transform: scale(1.05); box-shadow: 0 8rpx 20rpx rgba(16, 185, 129, 0.7); }
	100% { transform: scale(1); box-shadow: 0 6rpx 15rpx rgba(16, 185, 129, 0.5); }
}

@keyframes float {
	0% { transform: translateY(0) scale(1); }
	50% { transform: translateY(-5rpx) scale(1.05); }
	100% { transform: translateY(0) scale(1); }
}

.score-text {
	font-size: 26rpx;
	color: white;
	font-weight: 800;
	position: relative;
	z-index: 1;
	letter-spacing: 0.5rpx;
}

.dish-description {
	font-size: 28rpx;
	color: #334155;
	margin-bottom: 25rpx;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	font-weight: 500;
	flex: 1;
	word-break: break-word;
	letter-spacing: 0.2rpx;
	transition: color 0.3s ease;
	padding: 0 30rpx;
}

.dish-meta {
	display: flex;
	gap: 35rpx;
	margin-bottom: 25rpx;
	padding: 15rpx 20rpx;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 15rpx;
	flex-wrap: wrap;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
	transition: all 0.3s ease;
	margin: 0 30rpx 25rpx 30rpx;
}

.meta-item {
	font-size: 26rpx;
	color: #1e293b;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.dish-cid-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 2rpx solid rgba(0, 0, 0, 0.05);
	min-height: 60rpx;
	padding: 0 30rpx 30rpx 30rpx;
}

.cid-tag {
	padding: 12rpx 25rpx;
	background: linear-gradient(135deg, #3b82f6, #6366f1);
	border-radius: 10rpx;
	font-size: 24rpx;
	color: white;
	font-weight: 700;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	transform: scale(1);
	letter-spacing: 0.5rpx;
	box-shadow: 0 4rpx 8rpx rgba(59, 130, 246, 0.3);
	animation: float 3s ease-in-out infinite;
	/* Add hover effect */
	cursor: pointer;
}

.cid-tag:hover {
	transform: scale(1.05);
	box-shadow: 0 8rpx 20rpx rgba(139, 92, 246, 0.6);
	/* Enhance hover effect */
	filter: brightness(1.1);
}

/* High match score styling */
.dish-card.high-match {
	border: 3rpx solid rgba(16, 185, 129, 0.9);
	box-shadow: 0 12rpx 30rpx rgba(16, 185, 129, 0.4), 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
	position: relative;
}

.dish-card.high-match::before {
	content: '🔥';
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 24rpx;
	z-index: 2;
}

/* Medium match score styling */
.dish-card.medium-match {
	border: 3rpx solid rgba(245, 158, 11, 0.9);
	box-shadow: 0 12rpx 30rpx rgba(245, 158, 11, 0.4), 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
}

.dish-card.medium-match::before {
	content: '⭐';
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 24rpx;
	z-index: 2;
}

/* Subtle overlay for depth */
.dish-card::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
	pointer-events: none;
	border-radius: 25rpx;
}

/* Responsive grid for larger screens */
@media screen and (min-width: 768px) {
	.dish-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 40rpx;
	}
}

@media screen and (min-width: 1024px) {
	.dish-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 50rpx;
	}
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
	
	.favorites-section {
		padding: 0 30rpx 60rpx;
	}
	
	.favorite-card {
	border: 3rpx solid rgba(255, 100, 100, 0.9);
	box-shadow: 0 12rpx 30rpx rgba(255, 100, 100, 0.4), 0 6rpx 15rpx rgba(0, 0, 0, 0.1);
	position: relative;
	overflow: hidden;
	contain: layout style;
}

.favorite-card::before {
	content: '❤️';
	position: absolute;
	top: 15rpx;
	right: 15rpx;
	font-size: 28rpx;
	z-index: 2;
	background: rgba(255, 255, 255, 0.5);
	width: 45rpx;
	height: 45rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.favorite-card .dish-name {
	color: #0f172a;
}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.refresh-btn {
		padding: 10rpx 20rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 15rpx;
	}
	
	.refresh-text {
		font-size: 24rpx;
		color: white;
	}
	
	.no-favorites {
		text-align: center;
		padding: 40rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 25rpx;
	}
	
	.no-favorites-text {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
	
	.random-btn {
		margin-top: 30rpx;
		padding: 20rpx 40rpx;
		background: linear-gradient(45deg, #8b5cf6, #6366f1);
		border-radius: 25rpx;
		border: none;
	}
	
	.random-btn-text {
		color: white;
		font-size: 28rpx;
		font-weight: bold;
	}
</style>