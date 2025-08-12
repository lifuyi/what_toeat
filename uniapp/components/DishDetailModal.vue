<template>
	<view v-if="visible" class="modal-overlay" @tap="handleOverlayTap">
		<view class="modal-content" @tap.stop>
			<view class="modal-header">
				<view class="dish-image-large">
					<text class="dish-emoji-large">{{ dish?.emoji || '🍽️' }}</text>
				</view>
				<button class="close-btn" @tap="handleClose">×</button>
			</view>
			
			<view class="modal-body">
				<scroll-view scroll-y class="scroll-content">
					<view class="dish-info">
						<text class="dish-name-large">{{ dish?.name }}</text>
						<text class="dish-description-large">{{ dish?.description }}</text>
						
						<view class="dish-stats">
							<view class="stat-item">
								<text class="stat-icon">⏱️</text>
								<text class="stat-label">烹饪时间</text>
								<text class="stat-value">{{ dish?.cookingTime }}</text>
							</view>
							<view class="stat-item">
								<text class="stat-icon">👨‍🍳</text>
								<text class="stat-label">难度</text>
								<text class="stat-value">{{ getDifficultyText(dish?.difficulty) }}</text>
							</view>
							<view class="stat-item">
								<text class="stat-icon">🏷️</text>
								<text class="stat-label">分类</text>
								<text class="stat-value">{{ dish?.category }}</text>
							</view>
						</view>
						
						<view class="section">
							<text class="section-title">所需食材</text>
							<view class="ingredients-list">
								<view 
									v-for="ingredient in dish?.ingredients" 
									:key="ingredient"
									class="ingredient-item"
								>
									<text class="ingredient-text">{{ ingredient }}</text>
								</view>
							</view>
						</view>
						
						<view class="section">
							<text class="section-title">制作步骤</text>
							<view class="steps-list">
								<view 
									v-for="(step, index) in dish?.steps" 
									:key="index"
									class="step-item"
								>
									<view class="step-number">{{ index + 1 }}</view>
									<text class="step-text">{{ step }}</text>
								</view>
							</view>
						</view>
						
						<view class="section">
							<text class="section-title">标签</text>
							<view class="tags-container">
								<text 
									v-for="tag in dish?.tags" 
									:key="tag"
									class="tag-large"
								>
									{{ tag }}
								</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'DishDetailModal',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			dish: {
				type: Object,
				default: null
			}
		},
		methods: {
			handleClose() {
				this.$emit('close')
			},
			
			handleOverlayTap() {
				this.handleClose()
			},
			
			getDifficultyText(difficulty) {
				const difficultyMap = {
					'简单': '简单',
					'中等': '中等', 
					'困难': '困难',
					'1': '简单',
					'2': '中等',
					'3': '困难'
				}
				return difficultyMap[difficulty] || difficulty
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}
	
	.modal-content {
		background: white;
		border-radius: 20px;
		width: 100%;
		max-width: 500px;
		max-height: 80vh;
		overflow: hidden;
		position: relative;
	}
	
	.modal-header {
		position: relative;
		height: 200px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dish-image-large {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dish-emoji-large {
		font-size: 80px;
	}
	
	.close-btn {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 40px;
		height: 40px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		color: white;
		font-size: 24px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.modal-body {
		height: calc(80vh - 200px);
	}
	
	.scroll-content {
		height: 100%;
	}
	
	.dish-info {
		padding: 24px;
	}
	
	.dish-name-large {
		font-size: 24px;
		font-weight: 700;
		color: #1f2937;
		margin-bottom: 8px;
		display: block;
	}
	
	.dish-description-large {
		font-size: 16px;
		color: #6b7280;
		line-height: 1.5;
		margin-bottom: 24px;
		display: block;
	}
	
	.dish-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-bottom: 32px;
	}
	
	.stat-item {
		text-align: center;
		padding: 16px;
		background: #f9fafb;
		border-radius: 12px;
	}
	
	.stat-icon {
		font-size: 24px;
		display: block;
		margin-bottom: 8px;
	}
	
	.stat-label {
		font-size: 12px;
		color: #6b7280;
		display: block;
		margin-bottom: 4px;
	}
	
	.stat-value {
		font-size: 14px;
		font-weight: 600;
		color: #374151;
		display: block;
	}
	
	.section {
		margin-bottom: 32px;
	}
	
	.section-title {
		font-size: 18px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 16px;
		display: block;
	}
	
	.ingredients-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}
	
	.ingredient-item {
		padding: 8px 12px;
		background: #f3f4f6;
		border-radius: 8px;
	}
	
	.ingredient-text {
		font-size: 14px;
		color: #374151;
	}
	
	.steps-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	
	.step-item {
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}
	
	.step-number {
		width: 24px;
		height: 24px;
		border-radius: 12px;
		background: #667eea;
		color: white;
		font-size: 12px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 2px;
	}
	
	.step-text {
		flex: 1;
		font-size: 14px;
		color: #374151;
		line-height: 1.5;
	}
	
	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	
	.tag-large {
		padding: 6px 12px;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 16px;
		font-size: 12px;
		font-weight: 500;
	}
</style>