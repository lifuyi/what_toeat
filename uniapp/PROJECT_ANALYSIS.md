# What to Eat Uniapp Project Analysis

## Project Overview

This is a Uniapp-based multi-platform food recommendation application named "今天吃什么" (What to Eat). The app provides intelligent food recommendations based on user preferences and available ingredients.

## Key Features

### 1. Multi-Platform Support
- H5 web application
- WeChat Mini Program
- Alipay Mini Program
- Baidu Smart Mini Program
- ByteDance/Toutiao Mini Program
- QQ Mini Program
- Kuaishou Mini Program
- Native Mobile App (Android/iOS)

### 2. Core Functionality
- AI-powered food recommendations based on 5 preference dimensions:
  - Healthiness
  - Difficulty level
  - Vegetarian preference
  - Spiciness
  - Sweetness
- Ingredient-based search functionality
- Text-based recipe search
- Predefined preference presets (6 quick configurations)
- Favorites system with local storage
- Detailed dish information display

### 3. User Interface
- Modern gradient-based design with glassmorphism effects
- Interactive radar chart for visualizing preference settings
- Responsive layout for different screen sizes
- Smooth animations and transitions

## Technical Architecture

### 1. File Structure
```
Uniapp/
├── App.vue              # Main application component
├── main.js              # Application entry point
├── manifest.json        # Platform configuration
├── pages.json           # Page routing configuration
├── uni.scss             # Global SCSS variables
├── pages/
│   ├── index/           # Main page with recommendations
│   ├── dish-detail/     # Dish detail view
│   └── test-api/        # API testing utilities
├── static/              # Static assets
└── utils/               # Utility functions
    ├── api.js           # API service layer
    ├── config.js        # Application configuration
    └── platform.js      # Platform-specific adapters
```

### 2. Styling System
- Uses SCSS variables for consistent theming
- Implements a gradient-based color scheme with purple/blue tones
- Employs glassmorphism effects with backdrop-filter
- Responsive design using rpx units
- Consistent component styling across pages

### 3. Data Management
- Local storage for favorites and user preferences
- API service layer for backend communication
- Platform-specific adapters for cross-platform compatibility
- Data conversion utilities for normalizing backend responses

### 4. Platform Adaptation
- Dynamic API URL configuration based on platform
- Platform-specific error handling and messaging
- Network protocol adaptation (HTTP/HTTPS)
- Feature detection and limitation handling

## Implementation Details

### 1. Preference System
- 5-dimensional preference model with values from 1-10
- Interactive radar chart for visual preference adjustment
- Touch-based interaction for real-time preference updates
- Preset configurations for quick setup

### 2. Recommendation Algorithm
- Match score calculation based on preference similarity
- Weighted scoring system for different preference dimensions
- Real-time updates when preferences change

### 3. Search Functionality
- Text-based recipe search
- Ingredient-based search with matching percentage calculation
- Search result filtering and display

### 4. Favorites System
- Local storage persistence
- Event-based communication between pages
- Search term filtering for favorites
- Visual indicators for favorited items

## API Integration

### 1. Endpoints
- `/api/recipes` - Get all recipes/search recipes
- `/api/recipes/ingredients` - Search by ingredients
- `/api/recommendations` - Get personalized recommendations

### 2. Data Format
- Backend data conversion to frontend-friendly format
- Automatic parsing of ingredients and steps
- Tag extraction from multiple possible fields

## Platform-Specific Considerations

### 1. H5
- CORS configuration requirements
- HTTP/HTTPS flexibility in development

### 2. Mini Programs
- HTTPS requirement
- Domain whitelist configuration
- Platform-specific error handling

### 3. Native Apps
- Full network protocol support
- Access to native device features

## Development Workflow

### 1. Environment Setup
- HBuilderX IDE recommended
- Node.js backend server on port 3001
- Platform-specific configuration in manifest.json

### 2. Testing
- Built-in API testing page
- Platform-specific debugging tools
- Cross-platform compatibility verification

## Future Enhancement Opportunities

### 1. Additional Features
- Location-based recommendations
- Social sharing functionality
- User account system
- Recipe rating and reviews
- Cooking timer integration

### 2. Technical Improvements
- Enhanced caching mechanisms
- Offline functionality
- Performance optimization for large datasets
- Advanced recommendation algorithms