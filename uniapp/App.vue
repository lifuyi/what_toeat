<template>
	<!-- 这里不需要写任何内容 -->
</template>

<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni.scss';
	
	/* 全局样式 */
	page {
		background-color: #f8f9fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
	}
	
	/* 通用卡片样式 */
	.card {
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin: 16px;
		overflow: hidden;
	}
	
	.card-header {
		padding: 20px;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.card-content {
		padding: 20px;
	}
	
	.card-title {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 8px;
	}
	
	/* 按钮样式 */
	.btn {
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		text-align: center;
		transition: all 0.3s ease;
	}
	
	.btn-primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}
	
	.btn-secondary {
		background: #f8f9fa;
		color: #6c757d;
		border: 1px solid #dee2e6;
	}
	
	/* 动画 */
	.fade-in {
		animation: fadeIn 0.5s ease-in;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.float {
		animation: float 3s ease-in-out infinite;
	}
	
	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>