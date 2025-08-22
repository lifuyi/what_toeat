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
				<text class="description-text">{{ dish.description || '美味当家，点击查看详细做法...' }}</text>
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
			
			<!-- CID Tags -->
			<view class="cid-section" v-if="dish.cid">
				<text class="section-title">🆔 分类标识</text>
				<view class="cid-tags">
					<text v-for="(cidTag, index) in splitCidTags(dish.cid)" :key="index" class="cid-tag">{{ cidTag }}</text>
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
				<button class="action-btn secondary" @tap="toggleFavorite">
					<text class="btn-text">{{ isFavorited ? '💔 取消收藏' : '❤️ 收藏菜谱' }}</text>
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
			},
			isFavorited: false
		}
	},
	onLoad(options) {
		if (options.dish) {
			try {
				this.dish = JSON.parse(decodeURIComponent(options.dish));
				this.checkIfFavorited();
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
				this.checkIfFavorited();
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
		checkIfFavorited() {
			// 检查是否已收藏
			const favorites = uni.getStorageSync(CONFIG.STORAGE_KEYS.FAVORITES) || [];
			this.isFavorited = favorites.some(fav => fav.id === this.dish.id);
		},
		toggleFavorite() {
			// 收藏/取消收藏功能
			let favorites = uni.getStorageSync(CONFIG.STORAGE_KEYS.FAVORITES) || [];
			const isAlreadyFavorited = favorites.some(fav => fav.id === this.dish.id);
			
			if (isAlreadyFavorited) {
				// 取消收藏
				favorites = favorites.filter(fav => fav.id !== this.dish.id);
				uni.setStorageSync(CONFIG.STORAGE_KEYS.FAVORITES, favorites);
				this.isFavorited = false;
				uni.showToast({
					title: '已取消收藏',
					icon: 'success'
				});
			} else {
				// 添加收藏
				favorites.push(this.dish);
				uni.setStorageSync(CONFIG.STORAGE_KEYS.FAVORITES, favorites);
				this.isFavorited = true;
				uni.showToast({
					title: '收藏成功',
					icon: 'success'
				});
			}
			
			// 通知首页更新收藏列表
			uni.$emit('favoritesUpdated');
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 30rpx;
	animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.dish-detail {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(20rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.2);
	border-radius: 35rpx;
	padding: 50rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15), 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
	position: relative;
	overflow: hidden;
	animation: slideInUp 0.8s ease-out;
}

.dish-detail::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
	pointer-events: none;
	border-radius: 35rpx;
}

@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(50rpx) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.dish-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 40rpx;
	padding-bottom: 30rpx;
	border-bottom: 3rpx solid rgba(255, 255, 255, 0.3);
	position: relative;
	z-index: 1;
}

.dish-header::after {
	content: '';
	position: absolute;
	bottom: -3rpx;
	left: 0;
	width: 80rpx;
	height: 3rpx;
	background: linear-gradient(90deg, #6366f1, #8b5cf6);
	border-radius: 2rpx;
}

.dish-name {
	font-size: 48rpx;
	font-weight: 800;
	color: white;
	text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
	flex: 1;
	margin-right: 30rpx;
	line-height: 1.3;
	letter-spacing: 1rpx;
}

.match-score {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	padding: 15rpx 25rpx;
	border-radius: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(16, 185, 129, 0.4);
	position: relative;
	overflow: hidden;
}

.match-score::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
	animation: shimmer 3s infinite;
}

@keyframes shimmer {
	0% { left: -100%; }
	100% { left: 100%; }
}

.score-text {
	font-size: 28rpx;
	color: white;
	font-weight: 700;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	position: relative;
	z-index: 1;
}

.dish-description {
	margin-bottom: 40rpx;
	padding: 30rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 25rpx;
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	position: relative;
	z-index: 1;
}

.description-text {
	font-size: 32rpx;
	color: white;
	line-height: 1.7;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
	font-weight: 400;
}

.dish-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 40rpx;
	margin-bottom: 50rpx;
	padding: 35rpx;
	background: rgba(255, 255, 255, 0.15);
	border-radius: 25rpx;
	backdrop-filter: blur(15rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.25);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 15rpx;
	padding: 15rpx 20rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	transition: all 0.3s ease;
}

.meta-item:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateY(-2rpx);
}

.meta-icon {
	font-size: 32rpx;
	filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
}

.meta-text {
	font-size: 30rpx;
	color: white;
	font-weight: 600;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.section-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: white;
	margin-bottom: 30rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	position: relative;
	padding-left: 20rpx;
}

.section-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 6rpx;
	height: 30rpx;
	background: linear-gradient(135deg, #6366f1, #8b5cf6);
	border-radius: 3rpx;
}

.tags-section {
	margin-bottom: 50rpx;
	animation: slideInLeft 0.8s ease-out 0.2s both;
}

@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-30rpx);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.tags {
	display: flex;
	flex-wrap: wrap;
	gap: 18rpx;
}

.tag {
	padding: 12rpx 24rpx;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
	border-radius: 25rpx;
	font-size: 26rpx;
	color: white;
	font-weight: 500;
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	transition: all 0.3s ease;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.tag:hover {
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%);
	transform: translateY(-2rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.ingredients-section {
	margin-bottom: 50rpx;
	animation: slideInRight 0.8s ease-out 0.4s both;
}

@keyframes slideInRight {
	from {
		opacity: 0;
		transform: translateX(30rpx);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.ingredients {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 25rpx;
	padding: 40rpx;
	backdrop-filter: blur(15rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.25);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.ingredient-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	padding: 15rpx 20rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	transition: all 0.3s ease;
	border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.ingredient-item:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateX(10rpx);
}

.ingredient-item:last-child {
	margin-bottom: 0;
}

.ingredient-bullet {
	font-size: 32rpx;
	color: #10b981;
	margin-right: 20rpx;
	font-weight: bold;
	filter: drop-shadow(0 2rpx 4rpx rgba(16, 185, 129, 0.3));
}

.ingredient-text {
	font-size: 30rpx;
	color: white;
	font-weight: 500;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.steps-section {
	margin-bottom: 60rpx;
	animation: slideInUp 0.8s ease-out 0.6s both;
}

@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.steps {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 25rpx;
	padding: 40rpx;
	backdrop-filter: blur(15rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.25);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	position: relative;
	z-index: 1;
}

.step-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 30rpx;
	padding: 20rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20rpx;
	transition: all 0.3s ease;
	border: 1rpx solid rgba(255, 255, 255, 0.15);
}

.step-item:hover {
	background: rgba(255, 255, 255, 0.2);
	transform: translateX(5rpx);
}

.step-item:last-child {
	margin-bottom: 0;
}

.step-number {
	width: 60rpx;
	height: 60rpx;
	background: linear-gradient(135deg, #6366f1, #8b5cf6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 25rpx;
	flex-shrink: 0;
	box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.4);
	position: relative;
	overflow: hidden;
}

.step-number::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
	border-radius: 50%;
}

.step-num {
	font-size: 28rpx;
	color: white;
	font-weight: 700;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
	position: relative;
	z-index: 1;
}

.step-text {
	font-size: 30rpx;
	color: white;
	line-height: 1.6;
	flex: 1;
	font-weight: 400;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.actions {
	display: flex;
	gap: 25rpx;
	animation: slideInUp 0.8s ease-out 0.8s both;
}

.action-btn {
	flex: 1;
	padding: 30rpx;
	border-radius: 30rpx;
	border: none;
	font-size: 32rpx;
	font-weight: 700;
	transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	backdrop-filter: blur(10rpx);
	border: 2rpx solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
}

.action-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: left 0.6s ease;
}

.action-btn:hover::before {
	left: 100%;
}

.action-btn:hover {
	transform: translateY(-4rpx) scale(1.02);
	box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.2);
}

.action-btn:active {
	transform: translateY(-2rpx) scale(0.98);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
}

.primary {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	color: white;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.secondary {
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	color: white;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.btn-text {
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	position: relative;
	z-index: 1;
}
	
.cid-section {
	margin-bottom: 50rpx;
	animation: slideInLeft 0.8s ease-out 0.3s both;
}
	
.cid-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 18rpx;
}
	
.cid-tag {
	padding: 12rpx 24rpx;
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
	border-radius: 25rpx;
	font-size: 26rpx;
	color: white;
	font-weight: 500;
	box-shadow: 0 4rpx 12rpx rgba(99, 102, 241, 0.3);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
	backdrop-filter: blur(10rpx);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.cid-tag::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.cid-tag:hover {
	transform: translateY(-2rpx);
	box-shadow: 0 6rpx 16rpx rgba(99, 102, 241, 0.4);
}

.cid-tag:hover::before {
	opacity: 1;
}
</style>
</style>