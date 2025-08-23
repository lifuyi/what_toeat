# 项目概述

这是一个基于UniApp开发的多平台美食推荐应用，名为"今天吃什么"。该应用支持H5、微信小程序、支付宝小程序、百度小程序、字节跳动小程序、QQ小程序、快手小程序以及App（Android/iOS）等多个平台部署。

## 核心功能

- **智能推荐**：基于用户口味偏好的AI推荐算法
- **食材搜索**：根据用户现有食材推荐菜品
- **文本搜索**：按菜品名称搜索
- **偏好调节**：5维度口味偏好控制（健康度、难度、素食度、辣味度、甜味度）
- **预设配置**：6种快速偏好模式（健康达人、简单易做、素食主义、重口味、精致烹饪、均衡口味）
- **菜品详情**：完整的制作步骤和食材清单

## 技术架构

- **前端框架**：UniApp (Vue.js)
- **状态管理**：使用Vue的响应式数据
- **UI组件**：自定义样式组件
- **网络请求**：封装的`uni.request` API
- **本地存储**：`uni.setStorageSync`和`uni.getStorageSync`
- **图表绘制**：Canvas 2D API用于雷达图展示偏好设置

## 目录结构

```
Uniapp/
├── App.vue                 # 应用入口文件
├── main.js                 # 项目入口文件
├── manifest.json           # 应用配置文件
├── pages.json              # 页面路由配置
├── uni.scss                # 全局样式变量
├── package.json            # 项目依赖配置
├── README.md               # 项目说明文档
├── utils/                  # 工具类目录
│   ├── api.js              # API请求封装
│   ├── config.js           # 应用配置
│   └── platform.js         # 平台检测工具
├── pages/                  # 页面目录
│   ├── index/              # 首页
│   ├── dish-detail/        # 菜品详情页
│   └── test-api/           # API测试页
└── static/                 # 静态资源目录
```

# 开发与构建

## 环境要求

- HBuilderX 3.0+
- Node.js 14+
- 后端服务器运行在端口3001

## 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd Uniapp
   ```

2. **配置API地址**
   编辑 `utils/config.js`：
   ```javascript
   export const CONFIG = {
       API: {
           DEV_BASE_URL: 'http://localhost:3001',  // 开发环境
           PROD_BASE_URL: 'https://your-api.com', // 生产环境
       }
   };
   ```

3. **启动后端服务器**
   ```bash
   cd ../server
   npm install
   node server.js
   ```

4. **运行UniApp**
   - 在HBuilderX中打开项目
   - 选择运行平台（H5/微信小程序/App等）
   - 点击运行

## 测试API连接

1. 运行应用后，点击右上角"🔧 API测试"按钮
2. 依次测试各个功能模块
3. 查看控制台日志了解详细信息

## 构建命令

由于`package.json`中没有定义具体的构建脚本，UniApp项目通常使用HBuilderX进行构建和发布。

# 开发规范

## 代码风格

- 使用Vue.js的单文件组件（.vue）结构
- 组件样式使用scoped CSS或BEM命名规范
- JavaScript使用ES6+语法
- API请求统一通过`utils/api.js`封装处理

## 命名约定

- 组件文件名使用kebab-case（短横线分隔）
- 组件内方法使用camelCase（驼峰命名）
- 常量使用UPPER_SNAKE_CASE（大写蛇形命名）

## 平台适配

- 使用条件编译处理不同平台的差异（如`#ifdef H5`）
- 网络请求根据平台自动选择HTTP或HTTPS协议
- 本地存储使用uni-app提供的跨平台API

## 数据格式

后端数据库字段与前端显示字段的对应关系：
- `title` → `name` (菜品名称)
- `yl` → `ingredients` (食材列表)
- `steptext` → `steps` (制作步骤)
- `健康度` → `scores.healthy` (健康评分)
- `制作难易` → `scores.difficulty` (难度评分)

# 常见问题

## 小程序网络请求失败

**原因**: 未配置服务器域名白名单或使用了HTTP协议
**解决**: 
- 确保API使用HTTPS协议
- 在对应小程序平台配置域名白名单
- 开发时可开启"不校验合法域名"选项

## H5跨域问题

**原因**: 浏览器CORS策略限制
**解决**: 在服务器端配置CORS头部
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Platform', 'X-Client']
}));
```

## App网络请求超时

**原因**: 网络环境或服务器响应慢
**解决**: 
- 检查网络连接
- 增加请求超时时间
- 优化服务器响应速度