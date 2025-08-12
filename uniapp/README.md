# 智能食谱推荐 UniApp

基于 UniApp 开发的智能食谱推荐应用，与上级 client 文件夹中的 React 应用共享相同的 UI 设计和业务逻辑。

## 项目特性

### 🎯 核心功能
- **智能推荐**: 基于用户偏好的个性化菜谱推荐
- **雷达图控制**: 可视化调整健康度、难度、素食、辣度、甜度偏好
- **食材搜索**: 根据现有食材智能匹配菜谱
- **快速预设**: 提供健康饮食、快手料理等预设偏好
- **菜谱详情**: 详细的制作步骤和食材清单

### 🎨 UI 特色
- **渐变背景**: 美观的渐变色彩设计
- **卡片布局**: 现代化的卡片式界面
- **动画效果**: 流畅的过渡动画和交互反馈
- **响应式设计**: 适配不同屏幕尺寸
- **深色模式**: 支持明暗主题切换

### 📱 平台支持
- **H5**: 浏览器端运行
- **微信小程序**: 微信生态内使用
- **支付宝小程序**: 支付宝生态内使用
- **App**: 原生应用打包
- **其他小程序**: 百度、头条、QQ等平台

## 项目结构

```
uniapp/
├── components/              # 组件目录
│   ├── Header.vue          # 头部组件（主题切换、时间问候）
│   ├── DateInfo.vue        # 日期信息组件
│   ├── PresetButtons.vue   # 快速预设按钮
│   ├── RadarController.vue # 雷达图偏好控制器
│   ├── IngredientSearch.vue# 食材搜索组件
│   ├── DishRecommendation.vue # 菜谱推荐列表
│   ├── DishCard.vue        # 菜谱卡片
│   └── DishDetailModal.vue # 菜谱详情弹窗
├── pages/                  # 页面目录
│   └── index/
│       └── index.vue       # 主页面
├── data/                   # 数据目录
│   └── mockDishes.js       # 模拟菜谱数据
├── services/               # 服务目录
│   └── api.js              # API 接口封装
├── static/                 # 静态资源
├── App.vue                 # 应用入口
├── main.js                 # 主入口文件
├── manifest.json           # 应用配置
├── pages.json              # 页面配置
├── uni.scss                # 全局样式变量
└── package.json            # 项目依赖
```

## 核心组件说明

### Header 组件
- 动态时间问候（早上好/中午好/晚上好）
- 主题切换功能
- 装饰性动画元素
- 日期信息展示

### RadarController 组件
- Canvas 绘制的雷达图
- 五维偏好调节（健康、难度、素食、辣度、甜度）
- 实时可视化反馈
- 滑块控制器

### PresetButtons 组件
- 6种预设偏好模式
- 健康饮食、快手料理、家常美味等
- 一键设置偏好参数
- 视觉反馈和触觉反馈

### IngredientSearch 组件
- 食材输入和搜索
- 常用食材快速选择
- 已选食材管理
- 基于食材的菜谱匹配

### DishRecommendation 组件
- 智能推荐算法
- 匹配度评分显示
- 加载状态处理
- 错误状态处理

## 数据模型

### 偏好对象 (Preferences)
```javascript
{
  healthy: 5,      // 健康度 (1-10)
  difficulty: 2,   // 难度 (1-3: 简单/中等/困难)
  vegetarian: 5,   // 素食偏好 (1-10)
  spicy: 5,        // 辣度 (1-10)
  sweetness: 5     // 甜度 (1-10)
}
```

### 菜谱对象 (Dish)
```javascript
{
  id: "1",
  name: "番茄鸡蛋面",
  description: "经典家常面条，酸甜可口",
  ingredients: ["面条", "番茄", "鸡蛋"],
  steps: ["步骤1", "步骤2"],
  cookingTime: "15分钟",
  difficulty: "简单",
  tags: ["家常", "快手"],
  category: "面食",
  scores: {
    healthy: 8,
    difficulty: 1,
    vegetarian: 6,
    spicy: 2,
    sweetness: 4
  }
}
```

## 算法说明

### 推荐算法
采用加权评分算法，根据用户偏好计算菜谱匹配度：

```javascript
权重分配：
- 健康度: 25%
- 制作难度: 15%
- 素食偏好: 20%
- 辣度偏好: 20%
- 甜度偏好: 20%

匹配度 = Σ(10 - |用户偏好 - 菜谱评分|) × 权重
```

### 食材匹配
基于食材包含关系进行模糊匹配，支持：
- 完全匹配
- 部分匹配
- 按匹配食材数量排序

## 开发指南

### 环境要求
- Node.js >= 14.0.0
- HBuilderX 或 CLI 工具
- 各平台开发工具（可选）

### 本地开发
```bash
# 安装依赖
npm install

# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# 支付宝小程序开发
npm run dev:mp-alipay
```

### 构建发布
```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# App 构建
npm run build:app-plus
```

## 与 React 版本的对应关系

| React 组件 | UniApp 组件 | 功能说明 |
|------------|-------------|----------|
| App.tsx | pages/index/index.vue | 主应用入口 |
| Header.tsx | Header.vue | 头部组件 |
| RadarController.tsx | RadarController.vue | 雷达图控制器 |
| PresetButtons.tsx | PresetButtons.vue | 预设按钮 |
| IngredientSearch.tsx | IngredientSearch.vue | 食材搜索 |
| DishRecommendation.tsx | DishRecommendation.vue | 菜谱推荐 |
| DishCard.tsx | DishCard.vue | 菜谱卡片 |
| services/api.ts | services/api.js | API 服务 |
| data/mockDishes.ts | data/mockDishes.js | 模拟数据 |

## 技术栈

- **框架**: UniApp + Vue 3
- **样式**: SCSS + 内置样式变量
- **图表**: Canvas 原生绘制
- **状态管理**: Vue 3 Composition API
- **构建工具**: Vue CLI + UniApp CLI
- **代码规范**: ESLint

## 特色功能

### 1. 智能推荐引擎
- 多维度偏好分析
- 实时匹配度计算
- 个性化排序算法

### 2. 可视化交互
- Canvas 雷达图
- 实时数据更新
- 流畅动画效果

### 3. 用户体验优化
- 触觉反馈
- 加载状态
- 错误处理
- 响应式设计

### 4. 跨平台兼容
- 统一的 API 接口
- 平台适配处理
- 一致的用户体验

## 后续扩展

### 功能扩展
- [ ] 用户收藏功能
- [ ] 菜谱评分系统
- [ ] 社交分享功能
- [ ] 购物清单生成
- [ ] 营养成分分析

### 技术优化
- [ ] 数据持久化
- [ ] 离线缓存
- [ ] 性能监控
- [ ] 错误上报
- [ ] A/B 测试

## 许可证

MIT License

---

**注意**: 本项目是对上级 client 文件夹中 React 应用的 UniApp 移植版本，保持了相同的 UI 设计和业务逻辑，适配了 UniApp 的开发模式和多端发布需求。