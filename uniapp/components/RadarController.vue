<template>
	<view class="radar-controller">
		<view class="card">
			<view class="card-header">
				<text class="card-title">个性化偏好</text>
				<text class="card-subtitle">调整您的口味偏好</text>
			</view>
			<view class="card-content">
				<!-- 雷达图显示区域 -->
				<view class="radar-display">
					<canvas 
						canvas-id="radarChart" 
						class="radar-canvas"
						@touchstart="onCanvasTouch"
					></canvas>
				</view>
				
				<!-- 偏好滑块 -->
				<view class="sliders-container">
					<view 
						v-for="config in sliderConfigs" 
						:key="config.key"
						class="slider-item"
					>
						<view class="slider-header">
							<view class="slider-label">
								<text class="slider-emoji">{{ config.emoji }}</text>
								<text class="slider-name">{{ config.label }}</text>
							</view>
							<text class="slider-value">{{ getDisplayValue(config.key) }}</text>
						</view>
						<view class="slider-wrapper">
							<slider 
								:value="preferences[config.key]"
								:min="config.min || 1"
								:max="config.max || 10"
								:step="1"
								:activeColor="config.color"
								:backgroundColor="#e5e7eb"
								:block-color="config.color"
								:block-size="20"
								@change="(e) => handleSliderChange(config.key, e.detail.value)"
								class="custom-slider"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'RadarController',
		props: {
			preferences: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				sliderConfigs: [
					{
						key: 'healthy',
						label: '健康程度',
						emoji: '🥗',
						color: '#10b981',
						min: 1,
						max: 10
					},
					{
						key: 'difficulty',
						label: '制作难度',
						emoji: '👨‍🍳',
						color: '#f59e0b',
						min: 1,
						max: 3
					},
					{
						key: 'vegetarian',
						label: '素食偏好',
						emoji: '🌱',
						color: '#84cc16',
						min: 1,
						max: 10
					},
					{
						key: 'spicy',
						label: '辛辣程度',
						emoji: '🌶️',
						color: '#ef4444',
						min: 1,
						max: 10
					},
					{
						key: 'sweetness',
						label: '甜度偏好',
						emoji: '🍯',
						color: '#f97316',
						min: 1,
						max: 10
					}
				]
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.drawRadarChart()
			})
		},
		watch: {
			preferences: {
				handler() {
					this.drawRadarChart()
				},
				deep: true
			}
		},
		methods: {
			handleSliderChange(key, value) {
				const newPreferences = {
					...this.preferences,
					[key]: value
				}
				this.$emit('preferencesChange', newPreferences)
			},
			
			getDisplayValue(key) {
				const value = this.preferences[key]
				if (key === 'difficulty') {
					const levels = ['简单', '中等', '困难']
					return levels[value - 1] || '简单'
				}
				return value
			},
			
			drawRadarChart() {
				const ctx = uni.createCanvasContext('radarChart', this)
				const centerX = 150
				const centerY = 150
				const radius = 100
				
				// 清空画布
				ctx.clearRect(0, 0, 300, 300)
				
				// 绘制背景网格
				this.drawGrid(ctx, centerX, centerY, radius)
				
				// 绘制数据
				this.drawData(ctx, centerX, centerY, radius)
				
				ctx.draw()
			},
			
			drawGrid(ctx, centerX, centerY, radius) {
				const sides = 5 // 五边形
				const angleStep = (Math.PI * 2) / sides
				
				// 绘制同心圆
				ctx.setStrokeStyle('#e5e7eb')
				ctx.setLineWidth(1)
				for (let i = 1; i <= 5; i++) {
					const r = (radius * i) / 5
					ctx.beginPath()
					for (let j = 0; j <= sides; j++) {
						const angle = j * angleStep - Math.PI / 2
						const x = centerX + r * Math.cos(angle)
						const y = centerY + r * Math.sin(angle)
						if (j === 0) {
							ctx.moveTo(x, y)
						} else {
							ctx.lineTo(x, y)
						}
					}
					ctx.closePath()
					ctx.stroke()
				}
				
				// 绘制射线
				for (let i = 0; i < sides; i++) {
					const angle = i * angleStep - Math.PI / 2
					const x = centerX + radius * Math.cos(angle)
					const y = centerY + radius * Math.sin(angle)
					
					ctx.beginPath()
					ctx.moveTo(centerX, centerY)
					ctx.lineTo(x, y)
					ctx.stroke()
				}
			},
			
			drawData(ctx, centerX, centerY, radius) {
				const sides = 5
				const angleStep = (Math.PI * 2) / sides
				const data = [
					this.preferences.healthy,
					this.preferences.difficulty * 3.33, // 转换为10分制显示
					this.preferences.vegetarian,
					this.preferences.spicy,
					this.preferences.sweetness
				]
				
				// 绘制数据区域
				ctx.setFillStyle('rgba(102, 126, 234, 0.3)')
				ctx.setStrokeStyle('#667eea')
				ctx.setLineWidth(2)
				
				ctx.beginPath()
				for (let i = 0; i <= sides; i++) {
					const angle = i * angleStep - Math.PI / 2
					const value = data[i % sides] || 0
					const r = (radius * value) / 10
					const x = centerX + r * Math.cos(angle)
					const y = centerY + r * Math.sin(angle)
					
					if (i === 0) {
						ctx.moveTo(x, y)
					} else {
						ctx.lineTo(x, y)
					}
				}
				ctx.closePath()
				ctx.fill()
				ctx.stroke()
				
				// 绘制数据点
				ctx.setFillStyle('#667eea')
				for (let i = 0; i < sides; i++) {
					const angle = i * angleStep - Math.PI / 2
					const value = data[i]
					const r = (radius * value) / 10
					const x = centerX + r * Math.cos(angle)
					const y = centerY + r * Math.sin(angle)
					
					ctx.beginPath()
					ctx.arc(x, y, 4, 0, Math.PI * 2)
					ctx.fill()
				}
			},
			
			onCanvasTouch() {
				// 可以添加交互逻辑
			}
		}
	}
</script>

<style lang="scss" scoped>
	.radar-controller {
		margin: 0 16px 24px;
	}
	
	.card-subtitle {
		font-size: 14px;
		color: #6b7280;
		margin-top: 4px;
	}
	
	.radar-display {
		display: flex;
		justify-content: center;
		margin-bottom: 32px;
	}
	
	.radar-canvas {
		width: 300px;
		height: 300px;
	}
	
	.sliders-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	
	.slider-item {
		width: 100%;
	}
	
	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	
	.slider-label {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.slider-emoji {
		font-size: 20px;
	}
	
	.slider-name {
		font-size: 16px;
		font-weight: 500;
		color: #374151;
	}
	
	.slider-value {
		font-size: 16px;
		font-weight: 600;
		color: #667eea;
		min-width: 40px;
		text-align: right;
	}
	
	.slider-wrapper {
		padding: 0 8px;
	}
	
	.custom-slider {
		width: 100%;
	}
</style>