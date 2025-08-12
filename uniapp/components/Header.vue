<template>
	<view class="header" :class="{ 'dark': isDark }">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="sparkle sparkle-1">✨</view>
			<view class="sparkle sparkle-2">🌟</view>
			<view class="sparkle sparkle-3">💫</view>
		</view>
		
		<!-- 主题切换按钮 -->
		<view class="theme-toggle" @tap="handleThemeToggle">
			<text class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</text>
		</view>
		
		<!-- 标题内容 -->
		<view class="title-content fade-in">
			<view class="greeting">{{ greeting }}</view>
			<view class="main-title">
				<text class="highlight">智能</text>
				<text>{{ meal }}推荐</text>
			</view>
			<view class="subtitle">让AI为您推荐最适合的美食</view>
		</view>
		
		<!-- 日期信息 -->
		<DateInfo />
	</view>
</template>

<script>
	import DateInfo from './DateInfo.vue'
	
	export default {
		name: 'Header',
		components: {
			DateInfo
		},
		props: {
			isDark: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			timeBasedInfo() {
				const now = new Date()
				const hour = now.getHours()
				
				if (hour < 10) {
					return { greeting: '早上好', meal: '早餐' }
				} else if (hour >= 10 && hour < 16) {
					return { greeting: '中午好', meal: '午餐' }
				} else {
					return { greeting: '晚上好', meal: '晚餐' }
				}
			},
			greeting() {
				return this.timeBasedInfo.greeting
			},
			meal() {
				return this.timeBasedInfo.meal
			}
		},
		methods: {
			handleThemeToggle() {
				this.$emit('themeToggle')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		text-align: center;
		padding: 60px 32px 48px;
		position: relative;
		overflow: hidden;
	}
	
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}
	
	.sparkle {
		position: absolute;
		font-size: 24px;
		animation: float 3s ease-in-out infinite;
	}
	
	.sparkle-1 {
		top: 20%;
		left: 15%;
		animation-delay: 0s;
	}
	
	.sparkle-2 {
		top: 30%;
		right: 20%;
		animation-delay: 1s;
	}
	
	.sparkle-3 {
		bottom: 20%;
		left: 20%;
		animation-delay: 2s;
	}
	
	.theme-toggle {
		position: absolute;
		top: 40px;
		right: 32px;
		width: 48px;
		height: 48px;
		border-radius: 24px;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}
	
	.theme-toggle:active {
		transform: scale(0.95);
		background: rgba(255, 255, 255, 0.3);
	}
	
	.theme-icon {
		font-size: 24px;
	}
	
	.title-content {
		position: relative;
		z-index: 1;
	}
	
	.greeting {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 8px;
		font-weight: 400;
	}
	
	.main-title {
		font-size: 36px;
		font-weight: 700;
		color: white;
		margin-bottom: 12px;
		line-height: 1.2;
	}
	
	.highlight {
		background: linear-gradient(45deg, #ffd700, #ffed4e);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
		animation: pulse-color 3s ease-in-out infinite;
	}
	
	.subtitle {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 400;
		margin-bottom: 24px;
	}
	
	/* Dark mode styles */
	.header.dark {
		.theme-toggle {
			background: rgba(0, 0, 0, 0.2);
		}
		
		.greeting {
			color: rgba(255, 255, 255, 0.8);
		}
		
		.subtitle {
			color: rgba(255, 255, 255, 0.7);
		}
	}
	
	@keyframes pulse-color {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>