<template>
	<view class="dish-card" @tap="handleTap">
		<view class="dish-image">
			<text class="dish-emoji">{{ dish.emoji || '🍽️' }}</text>
			<view class="match-score">
				<text class="score-text">{{ Math.round(dish.matchScore || 0) }}%</text>
			</view>
		</view>
		
		<view class="dish-content">
			<text class="dish-name">{{ dish.name }}</text>
			<text class="dish-description">{{ dish.description }}</text>
			
			<view class="dish-meta">
				<view class="meta-item">
					<text class="meta-icon">⏱️</text>
					<text class="meta-text">{{ dish.cookingTime }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-icon">👨‍🍳</text>
					<text class="meta-text">{{ getDifficultyText(dish.difficulty) }}</text>
				</view>
			</view>
			
			<view class="dish-tags">
				<text 
					v-for="tag in dish.tags.slice(0, 2)" 
					:key="tag"
					class="tag"
				>
					{{ tag }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'DishCard',
		props: {
			dish: {
				type: Object,
				required: true
			}
		},
		methods: {
			handleTap() {
				this.$emit('tap', this.dish)
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
	.dish-card {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		position: relative;
	}
	
	.dish-card:active {
		transform: scale(0.98);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}
	
	.dish-image {
		height: 120px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.dish-emoji {
		font-size: 48px;
	}
	
	.match-score {
		position: absolute;
		top: 8px;
		right: 8px;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 12px;
		padding: 4px 8px;
	}
	
	.score-text {
		font-size: 12px;
		font-weight: 600;
		color: #667eea;
	}
	
	.dish-content {
		padding: 16px;
	}
	
	.dish-name {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 4px;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.dish-description {
		font-size: 12px;
		color: #6b7280;
		line-height: 1.4;
		margin-bottom: 12px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.dish-meta {
		display: flex;
		gap: 12px;
		margin-bottom: 12px;
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	
	.meta-icon {
		font-size: 12px;
	}
	
	.meta-text {
		font-size: 12px;
		color: #6b7280;
	}
	
	.dish-tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	
	.tag {
		padding: 2px 8px;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 12px;
		font-size: 10px;
		font-weight: 500;
	}
</style>