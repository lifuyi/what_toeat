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
		background: linear-gradient(135deg, #e0f7fa 0%, #f0fff0 100%);
		padding: 30rpx;
		animation: fadeIn 0.6s ease-out;
		font-family: 'Nunito', sans-serif;
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
		background: linear-gradient(135deg, rgba(254, 243, 199, 0.2) 0%, rgba(253, 230, 138, 0.2) 100%);
		backdrop-filter: blur(20rpx);
		border: 2rpx solid rgba(252, 203, 22, 0.3);
		border-radius: 35rpx;
		padding: 50rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15), 0 8rpx 25rpx rgba(0, 0, 0, 0.08);
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
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%);
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
		border-bottom: 3rpx solid rgba(252, 203, 22, 0.4);
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
		background: linear-gradient(90deg, #fccb16, #f59e0b);
		border-radius: 2rpx;
	}

	.dish-name {
		font-size: 48rpx;
		font-weight: 800;
		color: #1e293b;
		flex: 1;
		margin-right: 30rpx;
		line-height: 1.3;
		letter-spacing: 1rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.match-score {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		padding: 15rpx 25rpx;
		border-radius: 30rpx;
		box-shadow: 0 8rpx 20rpx rgba(16, 185, 129, 0.4);
		position: relative;
		overflow: hidden;
		align-self: flex-start;
		min-width: 140rpx;
		text-align: center;
	}

	.match-score::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% { left: -100%; }
		100% { left: 100%; }
	}

	.score-text {
		font-size: 28rpx;
		color: white;
		font-weight: 700;
		position: relative;
		z-index: 1;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
	}

	.dish-description {
		margin-bottom: 40rpx;
		padding: 30rpx;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 25rpx;
		border: 1rpx solid rgba(252, 203, 22, 0.3);
		position: relative;
		z-index: 1;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.description-text {
		font-size: 32rpx;
		color: #374151;
		line-height: 1.7;
		font-weight: 400;
	}

	.dish-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 40rpx;
		margin-bottom: 50rpx;
		padding: 35rpx;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 25rpx;
		border: 1rpx solid rgba(252, 203, 22, 0.35);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		position: relative;
		z-index: 1;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 15rpx 20rpx;
		background: rgba(252, 203, 22, 0.2);
		border-radius: 20rpx;
		transition: all 0.3s ease;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.meta-item:hover {
		background: rgba(252, 203, 22, 0.3);
		transform: translateY(-2rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.meta-icon {
		font-size: 32rpx;
	}

	.meta-text {
		font-size: 30rpx;
		color: #1e293b;
		font-weight: 600;
	}

	.section-title {
		display: block;
		font-size: 36rpx;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 30rpx;
		position: relative;
		padding-left: 20rpx;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
	}

	.section-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 6rpx;
		height: 30rpx;
		background: linear-gradient(to bottom, #fccb16, #f59e0b);
		border-radius: 3rpx;
	}

	.tags-section {
		margin-bottom: 50rpx;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 18rpx;
	}

	.tag {
		padding: 15rpx 28rpx;
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		border-radius: 30rpx;
		font-size: 26rpx;
		color: white;
		font-weight: 600;
		border: 2rpx solid rgba(255, 255, 255, 0.5);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 6rpx 16rpx rgba(99, 102, 241, 0.4), 0 2rpx 8rpx rgba(99, 102, 241, 0.3);
		position: relative;
		overflow: hidden;
		transform: translateY(0);
		animation: pulse 2s infinite;
	}

	.tag::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transform: rotate(45deg);
		transition: opacity 0.3s ease;
		z-index: 1;
	}

	.tag::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	.tag:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 10rpx 24rpx rgba(99, 102, 241, 0.5), 0 4rpx 12rpx rgba(99, 102, 241, 0.4);
		animation: none;
	}

	.tag:hover::after {
		opacity: 1;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 6rpx 16rpx rgba(99, 102, 241, 0.4), 0 2rpx 8rpx rgba(99, 102, 241, 0.3);
		}
		50% {
			box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.5), 0 4rpx 12rpx rgba(99, 102, 241, 0.4);
		}
		100% {
			box-shadow: 0 6rpx 16rpx rgba(99, 102, 241, 0.4), 0 2rpx 8rpx rgba(99, 102, 241, 0.3);
		}
	}

	.ingredients-section {
		margin-bottom: 50rpx;
	}

	.ingredients {
		background: rgba(255, 255, 255, 0.7);
		border-radius: 25rpx;
		padding: 40rpx;
		border: 1rpx solid rgba(252, 203, 22, 0.35);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		position: relative;
		z-index: 1;
	}

	.ingredient-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		padding: 15rpx 20rpx;
		background: rgba(252, 203, 22, 0.2);
		border-radius: 20rpx;
		transition: all 0.3s ease;
		border: 1rpx solid rgba(252, 203, 22, 0.2);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.ingredient-item:hover {
		background: rgba(252, 203, 22, 0.3);
		transform: translateX(10rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.ingredient-item:last-child {
		margin-bottom: 0;
	}

	.ingredient-bullet {
		font-size: 32rpx;
		color: #f59e0b;
		margin-right: 20rpx;
		font-weight: bold;
	}

	.ingredient-text {
		font-size: 30rpx;
		color: #1e293b;
		font-weight: 500;
	}

	.steps-section {
		margin-bottom: 60rpx;
	}

	.steps {
		background: rgba(255, 255, 255, 0.7);
		border-radius: 25rpx;
		padding: 40rpx;
		border: 1rpx solid rgba(252, 203, 22, 0.35);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		position: relative;
		z-index: 1;
	}

	.step-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 30rpx;
		padding: 20rpx;
		background: rgba(252, 203, 22, 0.2);
		border-radius: 20rpx;
		transition: all 0.3s ease;
		border: 1rpx solid rgba(252, 203, 22, 0.2);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.step-item:hover {
		background: rgba(252, 203, 22, 0.3);
		transform: translateX(5rpx);
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.step-item:last-child {
		margin-bottom: 0;
	}

	.step-number {
		width: 60rpx;
		height: 60rpx;
		background: linear-gradient(135deg, #fccb16 0%, #f59e0b 100%);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 25rpx;
		flex-shrink: 0;
		box-shadow: 0 4rpx 12rpx rgba(252, 203, 22, 0.4);
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
		color: #1e293b;
		font-weight: 700;
		position: relative;
		z-index: 1;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
	}

	.step-text {
		font-size: 30rpx;
		color: #1e293b;
		line-height: 1.6;
		flex: 1;
		font-weight: 400;
	}

	.actions {
		display: flex;
		gap: 25rpx;
		flex-wrap: wrap;
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
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
		min-width: 200rpx;
	}

	.action-btn:hover {
		transform: translateY(-4rpx) scale(1.02);
		box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.15);
	}

	.action-btn:active {
		transform: translateY(-2rpx) scale(0.98);
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
	}

	.primary {
		background: linear-gradient(135deg, #fccb16 0%, #f59e0b 100%);
		color: #1e293b;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
	}

	.secondary {
		background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
		color: white;
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
	}
		
	.cid-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 18rpx;
	}
		
	.cid-tag {
		padding: 15rpx 28rpx;
		background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
		border-radius: 30rpx;
		font-size: 26rpx;
		color: white;
		font-weight: 600;
		box-shadow: 0 6rpx 16rpx rgba(139, 92, 246, 0.4), 0 2rpx 8rpx rgba(139, 92, 246, 0.3);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
		border: 2rpx solid rgba(255, 255, 255, 0.5);
		transform: translateY(0);
		animation: cidPulse 2.5s infinite;
	}

	.cid-tag::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transform: rotate(45deg);
		transition: opacity 0.3s ease;
		z-index: 1;
	}

	.cid-tag::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	.cid-tag:hover {
		transform: translateY(-4rpx);
		box-shadow: 0 10rpx 24rpx rgba(139, 92, 246, 0.5), 0 4rpx 12rpx rgba(139, 92, 246, 0.4);
		animation: none;
	}

	.cid-tag:hover::after {
		opacity: 1;
	}

	@keyframes cidPulse {
		0% {
			box-shadow: 0 6rpx 16rpx rgba(139, 92, 246, 0.4), 0 2rpx 8rpx rgba(139, 92, 246, 0.3);
		}
		50% {
			box-shadow: 0 8rpx 20rpx rgba(139, 92, 246, 0.5), 0 4rpx 12rpx rgba(139, 92, 246, 0.4);
		}
		100% {
			box-shadow: 0 6rpx 16rpx rgba(139, 92, 246, 0.4), 0 2rpx 8rpx rgba(139, 92, 246, 0.3);
		}
	}
</style>