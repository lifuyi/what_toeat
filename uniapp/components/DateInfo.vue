<template>
	<view class="date-info">
		<view class="date-card">
			<view class="date-main">
				<text class="day">{{ currentDay }}</text>
				<view class="date-details">
					<text class="month-year">{{ currentMonthYear }}</text>
					<text class="weekday">{{ currentWeekday }}</text>
				</view>
			</view>
			<view class="weather-info">
				<text class="weather-icon">{{ weatherIcon }}</text>
				<text class="weather-text">{{ weatherText }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'DateInfo',
		data() {
			return {
				currentTime: new Date()
			}
		},
		computed: {
			currentDay() {
				return this.currentTime.getDate().toString().padStart(2, '0')
			},
			currentMonthYear() {
				const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				return `${this.currentTime.getFullYear()}年${months[this.currentTime.getMonth()]}`
			},
			currentWeekday() {
				const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
				return weekdays[this.currentTime.getDay()]
			},
			weatherIcon() {
				// 简单的天气图标逻辑，实际项目中可以接入天气API
				const hour = this.currentTime.getHours()
				if (hour >= 6 && hour < 18) {
					return '☀️'
				} else {
					return '🌙'
				}
			},
			weatherText() {
				return '适合烹饪'
			}
		},
		mounted() {
			// 每分钟更新一次时间
			this.timer = setInterval(() => {
				this.currentTime = new Date()
			}, 60000)
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.date-info {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}
	
	.date-card {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 16px 24px;
		display: flex;
		align-items: center;
		gap: 20px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.date-main {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	
	.day {
		font-size: 32px;
		font-weight: 700;
		color: white;
		line-height: 1;
	}
	
	.date-details {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	
	.month-year {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}
	
	.weekday {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.7);
		font-weight: 400;
	}
	
	.weather-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	
	.weather-icon {
		font-size: 20px;
	}
	
	.weather-text {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 400;
	}
</style>