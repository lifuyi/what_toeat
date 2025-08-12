<template>
	<view class="container">
		<!-- Header Component -->
		<Header :isDark="isDark" @themeToggle="toggleTheme" />
		
		<!-- Preset Buttons -->
		<PresetButtons @presetSelect="handlePresetSelect" />
		
		<!-- Radar Controller -->
		<RadarController 
			:preferences="preferences" 
			@preferencesChange="handlePreferencesChange" 
		/>
		
		<!-- Ingredient Search -->
		<IngredientSearch @search="handleIngredientSearch" />
		
		<!-- Dish Recommendations -->
		<DishRecommendation 
			:preferences="preferences" 
			:fetchTrigger="fetchTrigger"
			:searchTerm="searchTerm"
			:searchIngredients="searchIngredients"
		/>
	</view>
</template>

<script>
	import Header from '@/components/Header.vue'
	import PresetButtons from '@/components/PresetButtons.vue'
	import RadarController from '@/components/RadarController.vue'
	import IngredientSearch from '@/components/IngredientSearch.vue'
	import DishRecommendation from '@/components/DishRecommendation.vue'
	
	export default {
		components: {
			Header,
			PresetButtons,
			RadarController,
			IngredientSearch,
			DishRecommendation
		},
		data() {
			return {
				isDark: false,
				preferences: {
					healthy: 5,
					difficulty: 2,
					vegetarian: 5,
					spicy: 5,
					sweetness: 5
				},
				fetchTrigger: 0,
				searchTerm: '',
				searchIngredients: []
			}
		},
		onLoad() {
			// 检查系统主题
			this.checkSystemTheme()
		},
		methods: {
			toggleTheme() {
				this.isDark = !this.isDark
				// 可以在这里保存主题设置到本地存储
				uni.setStorageSync('isDark', this.isDark)
			},
			
			checkSystemTheme() {
				// 从本地存储获取主题设置
				const savedTheme = uni.getStorageSync('isDark')
				if (savedTheme !== '') {
					this.isDark = savedTheme
				} else {
					// 检查系统主题
					const systemInfo = uni.getSystemInfoSync()
					this.isDark = systemInfo.theme === 'dark'
				}
			},
			
			handlePresetSelect(preset) {
				this.preferences = { ...preset }
				this.fetchTrigger++
			},
			
			handlePreferencesChange(newPreferences) {
				this.preferences = { ...newPreferences }
				this.fetchTrigger++
			},
			
			handleIngredientSearch({ searchTerm, ingredients }) {
				this.searchTerm = searchTerm
				this.searchIngredients = ingredients
				this.fetchTrigger++
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding-bottom: 40px;
	}
	
	.container.dark {
		background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
	}
</style>