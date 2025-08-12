export const mockDishes = [
  {
    id: '1',
    name: '番茄鸡蛋面',
    description: '经典家常面条，酸甜可口，营养丰富',
    ingredients: ['面条', '番茄', '鸡蛋', '葱', '蒜', '生抽', '盐'],
    steps: [
      '准备食材：面条、番茄、鸡蛋、葱、蒜',
      '番茄切块，鸡蛋打散，葱蒜切末',
      '热锅下油，炒鸡蛋盛起备用',
      '下葱蒜爆香，加入番茄炒出汁水',
      '加入适量水煮开，下面条煮熟',
      '加入炒蛋，调味即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['家常', '快手', '营养'],
    category: '面食',
    scores: {
      healthy: 8,
      difficulty: 1,
      vegetarian: 6,
      spicy: 2,
      sweetness: 4
    }
  },
  {
    id: '2',
    name: '宫保鸡丁',
    description: '川菜经典，麻辣鲜香，下饭神器',
    ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒', '葱', '姜', '蒜', '生抽', '老抽', '料酒', '糖', '醋'],
    steps: [
      '鸡胸肉切丁，用料酒、生抽腌制',
      '花生米炸至金黄，干辣椒切段',
      '热锅下油，下鸡丁炒至变色',
      '下干辣椒、花椒爆香',
      '调入生抽、老抽、糖、醋炒匀',
      '最后加入花生米炒匀即可'
    ],
    cookingTime: '20分钟',
    difficulty: '中等',
    tags: ['川菜', '下饭', '麻辣'],
    category: '川菜',
    scores: {
      healthy: 7,
      difficulty: 2,
      vegetarian: 2,
      spicy: 8,
      sweetness: 3
    }
  },
  {
    id: '3',
    name: '蒸蛋羹',
    description: '嫩滑如豆腐，老少皆宜的营养美食',
    ingredients: ['鸡蛋', '温水', '盐', '香油', '葱花'],
    steps: [
      '鸡蛋打散，加入1.5倍温水',
      '加少许盐调味，搅拌均匀',
      '过筛去除泡沫，倒入蒸碗',
      '盖上保鲜膜，用牙签扎几个小孔',
      '水开后蒸10-12分钟',
      '出锅后淋香油，撒葱花即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['营养', '嫩滑', '老少皆宜'],
    category: '蒸菜',
    scores: {
      healthy: 9,
      difficulty: 1,
      vegetarian: 7,
      spicy: 1,
      sweetness: 2
    }
  },
  {
    id: '4',
    name: '麻婆豆腐',
    description: '四川名菜，麻辣鲜香，豆腐嫩滑',
    ingredients: ['嫩豆腐', '牛肉末', '豆瓣酱', '花椒粉', '葱', '姜', '蒜', '生抽', '老抽', '糖'],
    steps: [
      '豆腐切块，用盐水焯一下',
      '热锅下油，炒牛肉末至变色',
      '下豆瓣酱炒出红油',
      '加入葱姜蒜爆香',
      '加水煮开，下豆腐块',
      '调味后撒花椒粉和葱花'
    ],
    cookingTime: '18分钟',
    difficulty: '中等',
    tags: ['川菜', '麻辣', '经典'],
    category: '川菜',
    scores: {
      healthy: 6,
      difficulty: 2,
      vegetarian: 8,
      spicy: 9,
      sweetness: 2
    }
  },
  {
    id: '5',
    name: '清蒸鲈鱼',
    description: '鲜美清淡，保持鱼肉原味的健康做法',
    ingredients: ['鲈鱼', '葱', '姜', '蒸鱼豉油', '料酒', '盐', '香油'],
    steps: [
      '鲈鱼处理干净，两面划几刀',
      '用盐和料酒腌制10分钟',
      '葱姜切丝，铺在鱼身上下',
      '水开后蒸8-10分钟',
      '倒掉蒸出的水，重新摆盘',
      '淋蒸鱼豉油和香油即可'
    ],
    cookingTime: '25分钟',
    difficulty: '中等',
    tags: ['清淡', '营养', '鲜美'],
    category: '蒸菜',
    scores: {
      healthy: 10,
      difficulty: 2,
      vegetarian: 1,
      spicy: 1,
      sweetness: 2
    }
  },
  {
    id: '6',
    name: '红烧肉',
    description: '肥而不腻，入口即化的经典家常菜',
    ingredients: ['五花肉', '冰糖', '生抽', '老抽', '料酒', '葱', '姜', '八角'],
    steps: [
      '五花肉切块，冷水下锅焯水',
      '热锅下冰糖炒糖色',
      '下肉块炒至上色',
      '加入生抽、老抽、料酒',
      '加水没过肉块，放入葱姜八角',
      '大火烧开转小火炖1小时'
    ],
    cookingTime: '90分钟',
    difficulty: '困难',
    tags: ['经典', '下饭', '家常'],
    category: '红烧菜',
    scores: {
      healthy: 4,
      difficulty: 3,
      vegetarian: 1,
      spicy: 2,
      sweetness: 6
    }
  },
  {
    id: '7',
    name: '凉拌黄瓜',
    description: '清爽解腻，夏日必备的开胃小菜',
    ingredients: ['黄瓜', '蒜', '香醋', '生抽', '香油', '盐', '糖', '辣椒油'],
    steps: [
      '黄瓜洗净拍碎切段',
      '用盐腌制10分钟出水',
      '蒜切末，调制料汁',
      '倒掉腌出的水分',
      '加入蒜末和调料',
      '拌匀腌制15分钟即可'
    ],
    cookingTime: '10分钟',
    difficulty: '简单',
    tags: ['凉菜', '清爽', '开胃'],
    category: '凉菜',
    scores: {
      healthy: 9,
      difficulty: 1,
      vegetarian: 10,
      spicy: 4,
      sweetness: 3
    }
  },
  {
    id: '8',
    name: '糖醋里脊',
    description: '酸甜可口，外酥内嫩的经典菜品',
    ingredients: ['里脊肉', '鸡蛋', '淀粉', '面粉', '番茄酱', '白醋', '糖', '盐'],
    steps: [
      '里脊肉切条，用盐腌制',
      '调制糊：鸡蛋、淀粉、面粉',
      '肉条裹糊，油炸至金黄',
      '调糖醋汁：番茄酱、醋、糖',
      '热锅下糖醋汁炒至浓稠',
      '倒入炸好的肉条炒匀'
    ],
    cookingTime: '30分钟',
    difficulty: '困难',
    tags: ['酸甜', '外酥内嫩', '经典'],
    category: '糖醋菜',
    scores: {
      healthy: 5,
      difficulty: 3,
      vegetarian: 2,
      spicy: 1,
      sweetness: 9
    }
  },
  {
    id: '9',
    name: '青椒土豆丝',
    description: '简单易做，清脆爽口的素食佳品',
    ingredients: ['土豆', '青椒', '葱', '蒜', '干辣椒', '醋', '盐', '生抽'],
    steps: [
      '土豆去皮切丝，用水浸泡',
      '青椒切丝，葱蒜切末',
      '热锅下油，爆香葱蒜',
      '下土豆丝大火炒制',
      '加入青椒丝继续炒',
      '调味后淋醋炒匀即可'
    ],
    cookingTime: '12分钟',
    difficulty: '简单',
    tags: ['素食', '清脆', '家常'],
    category: '素菜',
    scores: {
      healthy: 8,
      difficulty: 1,
      vegetarian: 10,
      spicy: 3,
      sweetness: 2
    }
  },
  {
    id: '10',
    name: '小笼包',
    description: '皮薄馅大，汤汁丰富的江南名点',
    ingredients: ['面粉', '猪肉馅', '皮冻', '葱', '姜', '生抽', '老抽', '料酒', '盐', '糖'],
    steps: [
      '面粉加水和成光滑面团',
      '肉馅加调料搅拌上劲',
      '皮冻切碎拌入肉馅',
      '面团擀成小圆片',
      '包成小笼包形状',
      '蒸笼蒸15分钟即可'
    ],
    cookingTime: '120分钟',
    difficulty: '困难',
    tags: ['江南', '汤包', '精致'],
    category: '面点',
    scores: {
      healthy: 6,
      difficulty: 3,
      vegetarian: 3,
      spicy: 1,
      sweetness: 4
    }
  }
]