# 今天吃什么 - UniApp多平台美食推荐应用

## 📱 支持平台

本应用基于UniApp开发，支持多个平台部署：

### ✅ 已支持平台

| 平台 | 状态 | 特殊要求 | 备注 |
|------|------|----------|------|
| **H5** | ✅ 完全支持 | CORS配置 | 开发环境可用HTTP，生产环境建议HTTPS |
| **微信小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在微信公众平台配置服务器域名 |
| **支付宝小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在支付宝开放平台配置 |
| **百度小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在百度智能小程序平台配置 |
| **字节跳动小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在字节跳动开发者平台配置 |
| **QQ小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在QQ小程序开发者平台配置 |
| **快手小程序** | ✅ 完全支持 | HTTPS + 域名白名单 | 需在快手开发者平台配置 |
| **App (Android/iOS)** | ✅ 完全支持 | 无特殊要求 | 可使用HTTP/HTTPS |

### 🔧 平台特定配置

#### 1. H5平台
```javascript
// 开发环境
http://localhost:3001

// 生产环境需要配置CORS
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, X-Platform, X-Client
```

#### 2. 微信小程序
```javascript
// 需要在微信公众平台配置以下域名：
// 开发管理 -> 开发设置 -> 服务器域名

request合法域名：
https://your-api-domain.com

// 如果使用本地开发，需要开启"不校验合法域名"
```

#### 3. 其他小程序平台
类似微信小程序，都需要在对应的开发者平台配置HTTPS域名白名单。

## 🚀 快速开始

### 环境要求
- HBuilderX 3.0+
- Node.js 14+
- 后端服务器运行在端口3001

### 安装步骤

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

### 测试API连接
1. 运行应用后，点击右上角"🔧 API测试"按钮
2. 依次测试各个功能模块
3. 查看控制台日志了解详细信息

## 📋 功能特性

### 核心功能
- ✅ **智能推荐** - 基于口味偏好的AI推荐算法
- ✅ **食材搜索** - 根据现有食材推荐菜品
- ✅ **文本搜索** - 按菜品名称搜索
- ✅ **偏好调节** - 5维度口味偏好控制
- ✅ **预设配置** - 6种快速偏好模式
- ✅ **菜品详情** - 完整的制作步骤和食材清单

### 平台适配功能
- ✅ **自动平台检测** - 根据运行平台自动调整配置
- ✅ **网络协议适配** - 小程序自动使用HTTPS
- ✅ **错误处理优化** - 平台特定的错误提示
- ✅ **存储管理** - 跨平台的本地存储封装
- ✅ **导航适配** - 平台特定的页面跳转处理

## 🔧 开发指南

### 添加新平台支持

1. **更新manifest.json**
```json
{
    "mp-newplatform": {
        "usingComponents": true,
        // 平台特定配置
    }
}
```

2. **更新config.js**
```javascript
// 在getBaseUrl()函数中添加新平台判断
// #ifdef MP-NEWPLATFORM
return CONFIG.API.PROD_BASE_URL;
// #endif
```

3. **更新platform.js**
```javascript
// 在getPlatform()函数中添加新平台
// #ifdef MP-NEWPLATFORM
return 'mp-newplatform';
// #endif
```

### API接口说明

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/recipes` | GET | 获取所有菜品/搜索菜品 |
| `/api/recipes/ingredients` | GET | 按食材搜索菜品 |
| `/api/recommendations` | POST | 获取个性化推荐 |

### 数据格式转换

后端数据库字段 → 前端显示字段：
- `title` → `name` (菜品名称)
- `yl` → `ingredients` (食材列表)
- `steptext` → `steps` (制作步骤)
- `健康度` → `scores.healthy` (健康评分)
- `制作难易` → `scores.difficulty` (难度评分)

## 🐛 常见问题

### 1. 小程序网络请求失败
**原因**: 未配置服务器域名白名单或使用了HTTP协议
**解决**: 
- 确保API使用HTTPS协议
- 在对应小程序平台配置域名白名单
- 开发时可开启"不校验合法域名"选项

### 2. H5跨域问题
**原因**: 浏览器CORS策略限制
**解决**: 在服务器端配置CORS头部
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Platform', 'X-Client']
}));
```

### 3. App网络请求超时
**原因**: 网络环境或服务器响应慢
**解决**: 
- 检查网络连接
- 增加请求超时时间
- 优化服务器响应速度

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至：your-email@example.com