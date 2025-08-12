<template>
	<view class="ingredient-search">
		<view class="card">
			<view class="card-header">
				<text class="card-title">食材搜索</text>
				<text class="card-subtitle">输入现有食材，为您推荐菜谱</text>
			</view>
			<view class="card-content">
				<!-- 搜索输入框 -->
				<view class="search-container">
					<view class="search-input-wrapper">
						<input 
							v-model="searchInput"
							class="search-input"
							placeholder="输入食材名称，如：番茄、鸡蛋"
							@input="onSearchInput"
							@confirm="addIngredient"
						/>
						<view class="search-icon" @tap="addIngredient">
							<text>🔍</text>
						</view>
					</view>
				</view>
				
				<!-- 已选择的食材 -->
				<view v-if="selectedIngredients.length > 0" class="selected-ingredients">
					<text class="section-title">已选择食材</text>
					<view class="ingredients-list">
						<view 
							v-for="(ingredient, index) in selectedIngredients"
							:key="index"
							class="ingredient-tag"
							@tap="removeIngredient(index)"
						>
							<text class="ingredient-name">{{ ingredient }}</text>
							<text class="remove-icon">×</text>
						</view>
					</view>
				</view>
				
				<!-- 推荐食材 */
				<view class="recommended-ingredients">
					<text class="section-title">常用食材</text>
					<view class="ingredients-grid">
						<view 
							v-for="ingredient in commonIngredients"
							:key="ingredient.name"
							class="ingredient-item"
							:class="{ 'selected': selectedIngredients.includes(ingredient.name) }"
							@tap="toggleIngredient(ingredient.name)"
						>
							<text class="ingredient-emoji">{{ ingredient.emoji }}</text>
							<text class="ingredient-name">{{ ingredient.name }}</text>
						</view>
					</view>
				</view>
				
				<!-- 搜索按钮 -->
				<view class="search-actions">
					<button 
						class="search-btn"
						:class="{ 'disabled': selectedIngredients.length === 0 }"
						@tap="performSearch"
						:disabled="selectedIngredients.length === 0"
					>
						<text class="btn-text">搜索菜谱 ({{ selectedIngredients.length }})</text>
					</button>
					<button 
						v-if="selectedIngredients.length > 0"
						class="clear-btn"
						@tap="clearIngredients"
					>
						<text class="btn-text">清空</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'IngredientSearch',
		data() {
			return {
				searchInput: '',
				selectedIngredients: [],
				commonIngredients: [
					{ name: '番茄', emoji: '🍅' },
					{ name: '鸡蛋', emoji: '🥚' },
					{ name: '土豆', emoji: '🥔' },
					{ name: '洋葱', emoji: '🧅' },
					{ name: '胡萝卜', emoji: '🥕' },
					{ name: '白菜', emoji: '🥬' },
					{ name: '豆腐', emoji: '🧈' },
					{ name: '猪肉', emoji: '🥩' },
					{ name: '鸡肉', emoji: '🍗' },
					{ name: '牛肉', emoji: '🥩' },
					{ name: '鱼', emoji: '🐟' },
					{ name: '虾', emoji: '🦐' },
					{ name: '大蒜', emoji: '🧄' },
					{ name: '生姜', emoji: '🫚' },
					{ name: '青椒', emoji: '🫑' },
					{ name: '茄子', emoji: '🍆' },
					{ name: '黄瓜', emoji: '🥒' },
					{ name: '韭菜', emoji: '🌿' },
					{ name: '菠菜', emoji: '🥬' },
					{ name: '豆角', emoji: '🫘' }
				]
			}
		},
		methods: {
			onSearchInput(e) {
				this.searchInput = e.detail.value
			},
			
			addIngredient() {
				const ingredient = this.searchInput.trim()
				if (ingredient && !this.selectedIngredients.includes(ingredient)) {
					this.selectedIngredients.push(ingredient)
					this.searchInput = ''
					
					// 触觉反馈
					uni.vibrateShort({
						type: 'light'
					})
				}
			},
			
			removeIngredient(index) {
				this.selectedIngredients.splice(index, 1)
			},
			
			toggleIngredient(ingredient) {
				const index = this.selectedIngredients.indexOf(ingredient)
				if (index > -1) {
					this.selectedIngredients.splice(index, 1)
				} else {
					this.selectedIngredients.push(ingredient)
				}
				
				// 触觉反馈
				uni.vibrateShort({
					type: 'light'
				})
			},
			
			clearIngredients() {
				this.selectedIngredients = []
			},
			
			performSearch() {
				if (this.selectedIngredients.length === 0) {
					return
				}
				
				this.$emit('search', {
					searchTerm: '',
					ingredients: [...this.selectedIngredients]
				})
				
				uni.showToast({
					title: `搜索${this.selectedIngredients.length}种食材的菜谱`,
					icon: 'success',
					duration: 2000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ingredient-search {
		margin: 0 16px 24px;
	}
	
	.card-subtitle {
		font-size: 14px;
		color: #6b7280;
		margin-top: 4px;
	}
	
	.search-container {
		margin-bottom: 24px;
	}
	
	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	
	.search-input {
		flex: 1;
		height: 48px;
		padding: 0 50px 0 16px;
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		font-size: 16px;
		color: #374151;
		transition: all 0.3s ease;
	}
	
	.search-input:focus {
		border-color: #667eea;
		background: white;
	}
	
	.search-icon {
		position: absolute;
		right: 12px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #667eea;
		border-radius: 8px;
		font-size: 16px;
	}
	
	.section-title {
		font-size: 16px;
		font-weight: 600;
		color: #374151;
		margin-bottom: 12px;
		display: block;
	}
	
	.selected-ingredients {
		margin-bottom: 24px;
	}
	
	.ingredients-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	
	.ingredient-tag {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		background: #667eea;
		color: white;
		border-radius: 20px;
		font-size: 14px;
	}
	
	.ingredient-tag .remove-icon {
		font-size: 18px;
		font-weight: bold;
		opacity: 0.8;
	}
	
	.recommended-ingredients {
		margin-bottom: 24px;
	}
	
	.ingredients-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;
	}
	
	.ingredient-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12px 8px;
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		transition: all 0.3s ease;
		text-align: center;
	}
	
	.ingredient-item.selected {
		background: #667eea;
		border-color: #667eea;
		color: white;
	}
	
	.ingredient-item:active {
		transform: scale(0.95);
	}
	
	.ingredient-emoji {
		font-size: 24px;
		margin-bottom: 4px;
		display: block;
	}
	
	.ingredient-item .ingredient-name {
		font-size: 12px;
		font-weight: 500;
		color: #374151;
	}
	
	.ingredient-item.selected .ingredient-name {
		color: white;
	}
	
	.search-actions {
		display: flex;
		gap: 12px;
	}
	
	.search-btn {
		flex: 1;
		height: 48px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		transition: all 0.3s ease;
	}
	
	.search-btn.disabled {
		background: #e5e7eb;
		color: #9ca3af;
	}
	
	.search-btn:active:not(.disabled) {
		transform: scale(0.98);
	}
	
	.clear-btn {
		width: 80px;
		height: 48px;
		background: #f3f4f6;
		color: #6b7280;
		border: 1px solid #d1d5db;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 500;
	}
	
	.clear-btn:active {
		transform: scale(0.98);
		background: #e5e7eb;
	}
	
	.btn-text {
		color: inherit;
	}
</style>