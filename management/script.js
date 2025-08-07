document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const editForm = document.getElementById('editForm');
    const recipeIdInput = document.getElementById('recipeId');
    const recipeTitleInput = document.getElementById('recipeTitle');
    const recipeIngredientsInput = document.getElementById('recipeIngredients');
    const recipeInstructionsInput = document.getElementById('recipeInstructions');
    const recipeDidInput = document.getElementById('recipeDid');
    const recipeCidInput = document.getElementById('recipeCid');
    const recipeZidInput = document.getElementById('recipeZid');
    const recipeDifficultyInput = document.getElementById('recipeDifficulty');
    const recipeCosttimeInput = document.getElementById('recipeCosttime');
    const recipeGradeInput = document.getElementById('recipeGrade');
    const recipeHealthInput = document.getElementById('recipeHealth');
    const recipeDifficultyScoreInput = document.getElementById('recipeDifficultyScore');
    const recipeSpeedInput = document.getElementById('recipeSpeed');
    const recipeFavorInput = document.getElementById('recipeFavor');
    const recipeSpicyInput = document.getElementById('recipeSpicy');
    const recipeSweetInput = document.getElementById('recipeSweet');
    const recipeThumbInput = document.getElementById('recipeThumb');
    const recipeVideourlInput = document.getElementById('recipeVideourl');
    const recipeDescInput = document.getElementById('recipeDesc');
    const recipeTipInput = document.getElementById('recipeTip');
    const recipeFlInput = document.getElementById('recipeFl');
    const recipeSteppicInput = document.getElementById('recipeSteppic');
    const recipeUpInput = document.getElementById('recipeUp');
    const recipeViewnumInput = document.getElementById('recipeViewnum');
    const recipeFavnumInput = document.getElementById('recipeFavnum');
    const recipeOutdateInput = document.getElementById('recipeOutdate');
    const recipeStatusInput = document.getElementById('recipeStatus');
    const messageElement = document.getElementById('message');
    const thumbPreview = document.getElementById('thumbPreview');
    const thumbImage = document.getElementById('thumbImage');

    let currentRecipe = null;

    // 缩略图预览功能
    const updateThumbPreview = (url) => {
        if (url && url.trim()) {
            thumbImage.src = url.trim();
            thumbImage.onload = () => {
                thumbPreview.classList.remove('hidden');
            };
            thumbImage.onerror = () => {
                thumbPreview.classList.add('hidden');
            };
        } else {
            thumbPreview.classList.add('hidden');
        }
    };

    // 监听缩略图输入框变化
    recipeThumbInput.addEventListener('input', (e) => {
        updateThumbPreview(e.target.value);
    });

    const displayMessage = (msg, type) => {
        messageElement.textContent = msg;
        messageElement.className = `message ${type}`;
        messageElement.classList.remove('hidden');
        
        // 添加淡入效果
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageElement.classList.add('hidden');
            }, 300);
        }, 3000);
    };

    const displayRecipe = (recipe) => {
        if (recipe) {
            // Populate edit form
            recipeIdInput.value = recipe.id;
            recipeTitleInput.value = recipe.title;
            recipeIngredientsInput.value = recipe.yl;
            recipeInstructionsInput.value = recipe.steptext;
            recipeDidInput.value = recipe.did;
            recipeCidInput.value = recipe.cid;
            recipeZidInput.value = recipe.zid;
            recipeDifficultyInput.value = recipe.difficulty;
            recipeCosttimeInput.value = recipe.costtime;
            recipeGradeInput.value = recipe.grade;
            recipeHealthInput.value = recipe.健康度;
            recipeDifficultyScoreInput.value = recipe.制作难易;
            recipeSpeedInput.value = recipe.制作速度;
            recipeFavorInput.value = recipe.素食偏好;
            recipeSpicyInput.value = recipe.辛辣程度;
            recipeSweetInput.value = recipe.甜度;
            recipeThumbInput.value = recipe.thumb;
            recipeVideourlInput.value = recipe.videourl;
            recipeDescInput.value = recipe.desc;
            recipeTipInput.value = recipe.tip;
            recipeFlInput.value = recipe.fl;
            recipeSteppicInput.value = recipe.steppic;
            recipeUpInput.value = recipe.up;
            recipeViewnumInput.value = recipe.viewnum;
            recipeFavnumInput.value = recipe.favnum;
            recipeOutdateInput.value = recipe.outdate;
            recipeStatusInput.value = recipe.status;
            currentRecipe = recipe;
            
            // 更新缩略图预览
            updateThumbPreview(recipe.thumb);
        } else {
            // Clear edit form
            recipeIdInput.value = '';
            recipeTitleInput.value = '';
            recipeIngredientsInput.value = '';
            recipeInstructionsInput.value = '';
            recipeDidInput.value = '';
            recipeCidInput.value = '';
            recipeZidInput.value = '';
            recipeDifficultyInput.value = '';
            recipeCosttimeInput.value = '';
            recipeGradeInput.value = '';
            recipeHealthInput.value = '';
            recipeDifficultyScoreInput.value = '';
            recipeSpeedInput.value = '';
            recipeFavorInput.value = '';
            recipeSpicyInput.value = '';
            recipeSweetInput.value = '';
            recipeThumbInput.value = '';
            recipeVideourlInput.value = '';
            recipeDescInput.value = '';
            recipeTipInput.value = '';
            recipeFlInput.value = '';
            recipeSteppicInput.value = '';
            recipeUpInput.value = '';
            recipeViewnumInput.value = '';
            recipeFavnumInput.value = '';
            recipeOutdateInput.value = '';
            recipeStatusInput.value = '';
            currentRecipe = null;
            
            // 隐藏缩略图预览
            thumbPreview.classList.add('hidden');
        }
    };

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) {
            displayMessage('请输入菜谱ID或标题进行搜索', 'error');
            return;
        }

        // 添加加载状态
        searchButton.disabled = true;
        searchButton.innerHTML = '搜索中... <span class="loading"></span>';

        try {
            const response = await fetch(`http://localhost:3001/api/recipes?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // 处理搜索结果
            const foundRecipe = Array.isArray(data) ? data[0] : data;
            if (foundRecipe && Object.keys(foundRecipe).length > 0) {
                displayRecipe(foundRecipe);
                displayMessage('菜谱加载成功！', 'success');
            } else {
                displayMessage('未找到匹配的菜谱，请检查ID或标题', 'error');
            }
        } catch (error) {
            console.error('Error searching for recipe:', error);
            displayMessage('搜索失败，请检查服务器连接', 'error');
        } finally {
            // 恢复按钮状态
            searchButton.disabled = false;
            searchButton.innerHTML = '搜索';
        }
    };

    searchButton.addEventListener('click', performSearch);
    
    // 添加回车键搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 清空表单按钮事件
    clearButton.addEventListener('click', () => {
        displayRecipe(null);
        displayMessage('表单已清空，可以添加新菜品', 'success');
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!currentRecipe || !currentRecipe.id) {
            displayMessage('请先搜索并选择一个菜谱', 'error');
            return;
        }

        // 验证必需字段
        if (!recipeTitleInput.value.trim()) {
            displayMessage('菜谱标题不能为空', 'error');
            recipeTitleInput.focus();
            return;
        }

        const saveButton = document.getElementById('saveButton');
        saveButton.disabled = true;
        saveButton.innerHTML = '保存中... <span class="loading"></span>';

        const updatedRecipe = {
            title: recipeTitleInput.value.trim(),
            yl: recipeIngredientsInput.value,
            steptext: recipeInstructionsInput.value,
            did: recipeDidInput.value,
            cid: recipeCidInput.value,
            zid: recipeZidInput.value,
            difficulty: recipeDifficultyInput.value,
            costtime: recipeCosttimeInput.value,
            grade: recipeGradeInput.value,
            健康度: recipeHealthInput.value,
            制作难易: recipeDifficultyScoreInput.value,
            制作速度: recipeSpeedInput.value,
            素食偏好: recipeFavorInput.value,
            辛辣程度: recipeSpicyInput.value,
            甜度: recipeSweetInput.value,
            thumb: recipeThumbInput.value,
            videourl: recipeVideourlInput.value,
            desc: recipeDescInput.value,
            tip: recipeTipInput.value,
            fl: recipeFlInput.value,
            steppic: recipeSteppicInput.value,
            up: recipeUpInput.value,
            viewnum: recipeViewnumInput.value,
            favnum: recipeFavnumInput.value,
            outdate: recipeOutdateInput.value,
            status: recipeStatusInput.value
        };

        try {
            const response = await fetch(`http://localhost:3001/api/recipes/${currentRecipe.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRecipe)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Save successful:', result);
            displayMessage('菜谱保存成功！', 'success');

            // 更新当前菜谱数据
            if (result.recipe) {
                currentRecipe = result.recipe;
                displayRecipe(currentRecipe);
            }

        } catch (error) {
            console.error('Error saving recipe:', error);
            displayMessage(`保存失败：${error.message}`, 'error');
        } finally {
            saveButton.disabled = false;
            saveButton.innerHTML = '保存修改';
        }
    });
});