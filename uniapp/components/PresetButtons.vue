<template>
	<view class="preset-buttons">
		<view class="card">
			<view class="card-header">
				<text class="card-title">快速选择</text>
				<text class="card-subtitle">选择您的饮食偏好</text>
			</view>
			<view class="card-content">
				<view class="preset-grid">
					<view 
						v-for="preset in presets" 
						:key="preset.id"
						class="preset-item"
						:class="{ 'active': selectedPreset === preset.id }"
						@tap="selectPreset(preset)"
					>
						<view class="preset-icon">{{ preset.icon }}</view>
						<text class="preset-name">{{ preset.name }}</text>
						<text class="preset-desc">{{ preset.description }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PresetButtons',
		data() {
			return {
				selectedPreset: null,
				presets: [
					{
						id: 'healthy',
						name: '健康饮食',
						description: '低脂低糖，营养均衡',
						icon: '🥗',
						preferences: {
							healthy: 9,
							difficulty: 2,
							vegetarian: 7,
							spicy: 3,
							sweetness: 2
						}
					},
					{
						id: 'quick',
						name: '快手料理',
						description: '简单易做，省时省力',
						icon: '⚡',
						preferences: {
							healthy: 6,
							difficulty: 1,
							vegetarian: 5,
							spicy: 5,
							sweetness: 5
						}
					},
					{
						id: 'comfort',
						name: '家常美味',
						description: '温馨家常，回味无穷',
						icon: '🏠',
						preferences: {
							healthy: 7,
							difficulty: 2,
							vegetarian: 4,
							spicy: 6,
							sweetness: 6
						}
					},
					{
						id: 'gourmet',
						name: '精致料理',
						description: '工艺精湛，口感丰富',
						icon: '👨‍🍳',
						preferences: {
							healthy: 8,
							difficulty: 3,
							vegetarian: 6,
							spicy: 7,
							sweetness: 7
						}
					},
					{
						id: 'vegetarian',
						name: '素食主义',
						description: '纯素食材，清淡健康',
						icon: '🌱',
						preferences: {
							healthy: 9,
							difficulty: 2,
							vegetarian: 10,
							spicy: 4,
							sweetness: 4
						}
					},
					{
						id: 'spicy',
						name: '嗜辣一族',
						description: '香辣过瘾，刺激味蕾',
						icon: '🌶️',
						preferences: {
							healthy: 6,
							difficulty: 2,
							vegetarian: 5,
							spicy: 9,
							sweetness: 3
						}
					}
				]
			}
		},
		methods: {
			selectPreset(preset) {
				this.selectedPreset = preset.id
				this.$emit('presetSelect', preset.preferences)
				
				// 添加触觉反馈
				uni.vibrateShort({
					type: 'light'
				})
				
				// 显示选择提示
				uni.showToast({
					title: `已选择${preset.name}`,
					icon: 'success',
					duration: 1500
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.preset-buttons {
		margin: 0 16px 24px;
	}
	
	.card-subtitle {
		font-size: 14px;
		color: #6b7280;
		margin-top: 4px;
	}
	
	.preset-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}
	
	.preset-item {
		background: #f8f9fa;
		border-radius: 12px;
		padding: 16px;
		text-align: center;
		transition: all 0.3s ease;
		border: 2px solid transparent;
		position: relative;
		overflow: hidden;
	}
	
	.preset-item:active {
		transform: scale(0.98);
	}
	
	.preset-item.active {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-color: #667eea;
		color: white;
	}
	
	.preset-item.active .preset-name,
	.preset-item.active .preset-desc {
		color: white;
	}
	
	.preset-icon {
		font-size: 32px;
		margin-bottom: 8px;
		display: block;
	}
	
	.preset-name {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 4px;
		display: block;
	}
	
	.preset-desc {
		font-size: 12px;
		color: #6b7280;
		line-height: 1.4;
		display: block;
	}
	
	/* 添加波纹效果 */
	.preset-item::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
	}
	
	.preset-item:active::before {
		width: 300px;
		height: 300px;
	}
</style>