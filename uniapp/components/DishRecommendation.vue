<template>
	<view class="dish-recommendation">
		<view class="card">
			<view class="card-header">
				<text class="card-title">推荐菜谱</text>
				<text class="card-subtitle">
					{{ searchInfo.mode === 'ingredients' ? `基于${searchInfo.ingredients.length}种食材` : '基于您的偏好' }}
				</text>
			</view>
			<view class="card-content">
				<!-- 加载状态 -->
				<view v-if="loading" class="loading-container">
					<view class="loading-spinner"></view>
					<text class="loading-text">正在为您推荐美食...</text>
				</view>
				
				<!-- 错误状态 -->
				<view v-else-if="error" class="error-container">
					<text class="error-icon">😔</text>
					<text class="error-text">{{ error }}</text>
					<button class="retry-btn" @tap="retryFetch">重试</button>
				</view>
				
				<!-- 菜谱列表 -->
				<view v-else class="dishes-container">
					<view v-if="dishes.length === 0" class="empty-container">
						<text class="empty-icon">🍽️</text>
						<text class="empty-text">暂无符合条件的菜谱</text>
						<text class="empty-subtitle">试试调整您的偏好设置</text>
					</view>
					
					<view v-else class="dishes-grid">
						<DishCard 
							v-for="dish in dishes"
							:key="dish.id"
							:dish="dish"
							@tap="openDishDetail(dish)"
						/>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 菜谱详情弹窗 -->
		<DishDetailModal 
			:visible="isModalVisible"
			:dish="selectedDish"
			@close="closeModal"
		/>
	</view>
</template>

<script>
	import DishCard from './DishCard.vue'
	import DishDetailModal from './DishDetailModal.vue'
	import { mockDishes } from '@/data/mockDishes.js'
	
	export default {
		name: 'DishRecommendation',
		components: {
			DishCard,
			DishDetailModal
		},
		props: {
			preferences: {
				type: Object,
				required: true
			},
			fetchTrigger: {
				type: Number,
				default: 0
			},
			searchTerm: {
				type: String,
				default: ''
			},
			searchIngredients: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				dishes: [],
				loading: true,
				error: null,
				selectedDish: null,
				isModalVisible: false,
				searchInfo: {
					mode: 'preferences',
					ingredients: [],
					query: ''
				}
			}
		},
		watch: {
			fetchTrigger() {
				this.fetchRecommendations()
			},
			searchIngredients: {
				handler(newIngredients) {
					if (newIngredients && newIngredients.length > 0) {
						this.searchInfo.mode = 'ingredients'
						this.searchInfo.ingredients = newIngredients
						this.fetchRecommendations()
					}
				},
				immediate: true
			}
		},
		mounted() {
			this.fetchRecommendations()
		},
		methods: {
			async fetchRecommendations() {
				this.loading = true
				this.error = null
				
				try {
					// 模拟API请求延迟
					await new Promise(resolve => setTimeout(resolve, 1000))
					
					let filteredDishes = []
					
					if (this.searchInfo.mode === 'ingredients' && this.searchIngredients.length > 0) {
						// 基于食材搜索
						filteredDishes = this.searchByIngredients(this.searchIngredients)
					} else {
						// 基于偏好推荐
						filteredDishes = this.recommendByPreferences(this.preferences)
					}
					
					// 计算匹配分数并排序
					const dishesWithScores = filteredDishes.map(dish => ({
						...dish,
						matchScore: this.calculateMatchScore(dish)
					})).sort((a, b) => b.matchScore - a.matchScore)
					
					this.dishes = dishesWithScores.slice(0, 12) // 限制显示数量
					
				} catch (err) {
					this.error = '获取推荐失败，请稍后重试'
					console.error('Fetch recommendations error:', err)
				} finally {
					this.loading = false
				}
			},
			
			searchByIngredients(ingredients) {
				return mockDishes.filter(dish => {
					const dishIngredients = dish.ingredients.map(ing => ing.toLowerCase())
					return ingredients.some(ingredient => 
						dishIngredients.some(dishIng => 
							dishIng.includes(ingredient.toLowerCase()) || 
							ingredient.toLowerCase().includes(dishIng)
						)
					)
				})
			},
			
			recommendByPreferences(preferences) {
				return mockDishes.filter(dish => {
					// 基本过滤逻辑
					const difficultyMatch = dish.scores.difficulty <= preferences.difficulty
					const healthyMatch = Math.abs(dish.scores.healthy - preferences.healthy) <= 3
					const vegetarianMatch = preferences.vegetarian >= 7 ? dish.scores.vegetarian >= 7 : true
					
					return difficultyMatch && healthyMatch && vegetarianMatch
				})
			},
			
			calculateMatchScore(dish) {
				if (this.searchInfo.mode === 'ingredients') {
					// 基于食材匹配度计算分数
					const matchingIngredients = this.searchIngredients.filter(ingredient =>
						dish.ingredients.some(dishIng => 
							dishIng.toLowerCase().includes(ingredient.toLowerCase())
						)
					)
					return (matchingIngredients.length / this.searchIngredients.length) * 100
				} else {
					// 基于偏好匹配度计算分数
					const preferences = this.preferences
					const scores = dish.scores
					
					const healthyScore = 10 - Math.abs(scores.healthy - preferences.healthy)
					const difficultyScore = scores.difficulty <= preferences.difficulty ? 10 : 5
					const vegetarianScore = 10 - Math.abs(scores.vegetarian - preferences.vegetarian)
					const spicyScore = 10 - Math.abs(scores.spicy - preferences.spicy)
					const sweetnessScore = 10 - Math.abs(scores.sweetness - preferences.sweetness)
					
					return (healthyScore + difficultyScore + vegetarianScore + spicyScore + sweetnessScore) / 5 * 10
				}
			},
			
			openDishDetail(dish) {
				this.selectedDish = dish
				this.isModalVisible = true
			},
			
			closeModal() {
				this.isModalVisible = false
				this.selectedDish = null
			},
			
			retryFetch() {
				this.fetchRecommendations()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dish-recommendation {
		margin: 0 16px 24px;
	}
	
	.card-subtitle {
		font-size: 14px;
		color: #6b7280;
		margin-top: 4px;
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 20px;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #f3f4f6;
		border-top: 3px solid #667eea;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}
	
	.loading-text {
		font-size: 16px;
		color: #6b7280;
	}
	
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 20px;
	}
	
	.error-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}
	
	.error-text {
		font-size: 16px;
		color: #ef4444;
		margin-bottom: 16px;
		text-align: center;
	}
	
	.retry-btn {
		padding: 8px 16px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 14px;
	}
	
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 20px;
	}
	
	.empty-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}
	
	.empty-text {
		font-size: 18px;
		color: #374151;
		margin-bottom: 8px;
		font-weight: 500;
	}
	
	.empty-subtitle {
		font-size: 14px;
		color: #6b7280;
		text-align: center;
	}
	
	.dishes-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>