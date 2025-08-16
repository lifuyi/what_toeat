<script>
	export default {
		onLaunch: function() {
			console.log('What to Eat App Launch')
			// 初始化应用配置
			this.initApp()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initApp() {
				// 设置状态栏样式
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: '#6366f1'
				})
			}
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}
	
	/* 通用工具类 */
	.flex {
		display: flex;
	}
	
	.flex-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.text-center {
		text-align: center;
	}
	
	.text-white {
		color: white;
	}
	
	.mb-20 {
		margin-bottom: 20rpx;
	}
	
	.mb-30 {
		margin-bottom: 30rpx;
	}
	
	.p-20 {
		padding: 20rpx;
	}
	
	.p-30 {
		padding: 30rpx;
	}
	
	/* 动画效果 */
	.fade-in {
		animation: fadeIn 0.5s ease-in-out;
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
	
	.scale-in {
		animation: scaleIn 0.3s ease-out;
	}
	
	@keyframes scaleIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
