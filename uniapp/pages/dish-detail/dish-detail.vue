<template>
	<view class="container">
		<view class="dish-detail">
			<!-- Header -->
			<view class="dish-header">
				<text class="dish-name">{{ dish.name }}</text>
				<view v-if="dish.matchScore" class="match-score">
					<text class="score-text">{{ Math.round(dish.matchScore) }}%匹配</text>
				</view>
			</view>

			<!-- Description -->
			<view class="dish-description">
				<text class="description-text">{{ dish.description }}</text>
			</view>

			<!-- Meta info -->
			<view class="dish-meta">
				<view class="meta-item">
					<text class="meta-icon">⏱️</text>
					<text class="meta-text">{{ dish.cookingTime }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-icon">📊</text>
					<text class="meta-text">{{ dish.difficulty }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-icon">🏷️</text>
					<text class="meta-text">{{ dish.category || '家常菜' }}</text>
				</view>
			</view>

			<!-- Tags -->
			<view class="tags-section">
				<text class="section-title">🏷️ 菜品标签</text>
				<view class="tags">
					<text v-for="tag in dish.tags" :key="tag" class="tag">{{ tag }}</text>
				</view>
			</view>

			<!-- Ingredients -->
			<view class="ingredients-section">
				<text class="section-title">🥬 所需食材</text>
				<view class="ingredients">
					<view v-for="ingredient in dish.ingredients" :key="ingredient" class="ingredient-item">
						<text class="ingredient-bullet">•</text>
						<text class="ingredient-text">{{ ingredient }}</text>
					</view>
				</view>
			</view>

			<!-- Cooking steps -->
			<view class="steps-section">
				<text class="section-title">👨‍🍳 制作步骤</text>
				<view class="steps">
					<view v-for="(step, index) in dish.steps" :key="index" class="step-item">
						<view class="step-number">
							<text class="step-num">{{ index + 1 }}</text>
						</view>
						<text class="step-text">{{ step }}</text>
					</view>
				</view>
			</view>

			<!-- Action buttons -->
			<view class="actions">
				<button class="action-btn primary" @tap="startCooking">
					<text class="btn-text">🍳 开始制作</text>
				</button>
				<button class="action-btn secondary" @tap="addToFavorites">
					<text class="btn-text">❤️ 收藏菜谱</text>
				</button>
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
			dish: {
				id: '',
				name: '',
				description: '',
				cookingTime: '',
				difficulty: '',
				category: '',
				tags: [],
				ingredients: [],
				steps: [],
				matchScore: 0
			}
		}
	},
	onLoad(options) {
		if (options.dish) {
			try {
				this.dish = JSON.parse(decodeURIComponent(options.dish));
			} catch (e) {
				console.error('Failed to parse dish data:', e);
				uni.showToast({
					title: '数据解析失败',
					icon: 'error'
				});
			}
		} else if (options.id) {
			// 如果只传了ID，从API获取详细信息
			this.fetchDishDetail(options.id);
		}
	},
	methods: {
		async fetchDishDetail(id) {
			uni.showLoading({
				title: '加载中...'
			});
			
			try {
				const recipe = await api.getRecipeById(id);
				this.dish = api.convertRecipeToDish(recipe);
			} catch (error) {
				console.error('获取菜品详情失败:', error);
				api.handleApiError(error);
				uni.navigateBack();
			} finally {
				uni.hideLoading();
			}
		},
		startCooking() {
			uni.showToast({
				title: '开始制作！祝您烹饪愉快',
				icon: 'success',
				duration: 2000
			});
		},
		addToFavorites() {
			// 收藏功能
			const favorites = uni.getStorageSync(CONFIG.STORAGE_KEYS.FAVORITES) || [];
			const isAlreadyFavorited = favorites.some(fav => fav.id === this.dish.id);
			
			if (isAlreadyFavorited) {
				uni.showToast({
					title: '已在收藏夹中',
					icon: 'none'
				});
			} else {
				favorites.push(this.dish);
				uni.setStorageSync(CONFIG.STORAGE_KEYS.FAVORITES, favorites);
				uni.showToast({
					title: '收藏成功',
					icon: 'success'
				});
			}
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 30rpx;
}

.dish-detail {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	border-radius: 30rpx;
	padding: 40rpx;
}

.dish-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid rgba(255, 255, 255, 0.2);
}

.dish-name {
	font-size: 40rpx;
	font-weight: bold;
	color: white;
	flex: 1;
}

.match-score {
	background: linear-gradient(45deg, #10b981, #059669);
	padding: 10rpx 20rpx;
	border-radius: 25rpx;
}

.score-text {
	font-size: 24rpx;
	color: white;
	font-weight: bold;
}

.dish-description {
	margin-bottom: 30rpx;
}

.description-text {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.5;
}

.dish-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 30rpx;
	margin-bottom: 40rpx;
	padding: 25rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.meta-icon {
	font-size: 28rpx;
}

.meta-text {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
}

.section-title {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 25rpx;
}

.tags-section {
	margin-bottom: 40rpx;
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx;
}

.tag {
	padding: 10rpx 20rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 20rpx;
	font-size: 24rpx;
	color: white;
}

.ingredients-section {
	margin-bottom: 40rpx;
}

.ingredients {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 30rpx;
}

.ingredient-item {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.ingredient-item:last-child {
	margin-bottom: 0;
}

.ingredient-bullet {
	font-size: 30rpx;
	color: #10b981;
	margin-right: 15rpx;
	font-weight: bold;
}

.ingredient-text {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
}

.steps-section {
	margin-bottom: 50rpx;
}

.steps {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	padding: 30rpx;
}

.step-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.step-item:last-child {
	margin-bottom: 0;
}

.step-number {
	width: 50rpx;
	height: 50rpx;
	background: linear-gradient(45deg, #6366f1, #8b5cf6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.step-num {
	font-size: 24rpx;
	color: white;
	font-weight: bold;
}

.step-text {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.5;
	flex: 1;
}

.actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	padding: 25rpx;
	border-radius: 25rpx;
	border: none;
	font-size: 28rpx;
	font-weight: bold;
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.98);
}

.primary {
	background: linear-gradient(45deg, #10b981, #059669);
	color: white;
}

.secondary {
	background: linear-gradient(45deg, #f59e0b, #d97706);
	color: white;
}

.btn-text {
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
}
</style>