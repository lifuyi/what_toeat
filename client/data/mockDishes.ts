import { Dish } from '../components/DishRecommendation';

export const mockDishes: Dish[] = [
  {
    id: '1',
    name: '番茄鸡蛋面',
    description: '简单快手的家常面条，营养丰富',
    ingredients: ['鸡蛋 2个', '番茄 2个', '面条 200g', '葱花 适量', '盐 适量', '糖 少许'],
    steps: [
      '鸡蛋打散炒熟盛起备用',
      '番茄切块下锅炒出汁水',
      '加入调料炒制番茄酱',
      '倒入开水煮开',
      '下面条煮至8分熟',
      '加入炒蛋拌匀即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['快手', '营养', '家常'],
    category: '面食',
    scores: { healthy: 7, difficulty: 2, vegetarian: 6, spicy: 1, sweetness: 3 }
  },
  {
    id: '2',
    name: '宫保鸡丁',
    description: '经典川菜，麻辣鲜香',
    ingredients: ['鸡胸肉 300g', '花生米 100g', '干辣椒 10个', '花椒 1勺', '葱 2根', '姜蒜 适量'],
    steps: [
      '鸡肉切丁腌制15分钟',
      '花生米炸至金黄盛起',
      '热锅下鸡丁炒至变色',
      '加入干辣椒花椒爆香',
      '倒入调料汁炒匀',
      '最后加入花生米炒匀即可'
    ],
    cookingTime: '25分钟',
    difficulty: '中等',
    tags: ['川菜', '辣', '下饭'],
    category: '川菜',
    scores: { healthy: 6, difficulty: 6, vegetarian: 2, spicy: 8, sweetness: 2 }
  },
  {
    id: '3',
    name: '蒸蛋羹',
    description: '嫩滑如丝，营养丰富的经典蒸蛋',
    ingredients: ['鸡蛋 3个', '温水 200ml', '盐 少许', '香油 几滴', '葱花 适量', '生抽 1勺'],
    steps: [
      '鸡蛋打散，加入盐搅拌均匀',
      '缓慢倒入温水，边倒边搅拌',
      '过筛去除泡沫，倒入蒸碗',
      '盖上保鲜膜，用牙签扎几个小孔',
      '蒸锅水开后蒸12分钟',
      '出锅后淋香油、生抽，撒葱花即可'
    ],
    cookingTime: '20分钟',
    difficulty: '简单',
    tags: ['蒸菜', '嫩滑', '营养', '清淡'],
    category: '健康菜品',
    scores: { healthy: 9, difficulty: 2, vegetarian: 6, spicy: 0, sweetness: 10 }
  },
  {
    id: '4',
    name: '红烧排骨',
    description: '色泽红亮，肉质软烂，香甜可口',
    ingredients: ['排骨 600g', '生姜 3片', '八角 2个', '桂皮 1段', '冰糖 40g', '生抽 4勺', '老抽 2勺', '料酒 3勺'],
    steps: [
      '排骨剁段，冷水下锅焯水去血沫',
      '热锅下冰糖小火炒至焦糖色',
      '下排骨翻炒至上色均匀',
      '加入姜片、八角、桂皮炒香',
      '倒入生抽、老抽、料酒炒匀',
      '加开水没过排骨，大火烧开转小火',
      '盖盖炖煮45分钟至软烂',
      '大火收汁至浓稠即可'
    ],
    cookingTime: '65分钟',
    difficulty: '中等',
    tags: ['红烧', '软烂', '下饭', '家常'],
    category: '家常菜',
    scores: { healthy: 6, difficulty: 5, vegetarian: 1, spicy: 0, sweetness: 8 }
  },
  {
    id: '5',
    name: '凉拌黄瓜',
    description: '清脆爽口，开胃解腻的经典凉菜',
    ingredients: ['黄瓜 2根', '大蒜 3瓣', '香菜 适量', '生抽 2勺', '香醋 2勺', '香油 1勺', '盐 适量', '糖 少许', '辣椒油 适量'],
    steps: [
      '黄瓜洗净，用刀拍扁后切段',
      '撒盐腌制10分钟，挤出水分',
      '大蒜切末，香菜切段',
      '调制料汁：生抽、香醋、香油、糖、辣椒油',
      '将黄瓜、蒜末、香菜混合',
      '淋上调料汁拌匀即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['凉菜', '爽口', '开胃', '素食'],
    category: '凉菜',
    scores: { healthy: 9, difficulty: 1, vegetarian: 10, spicy: 3, sweetness: 9 }
  },
  {
    id: '6',
    name: '麻婆豆腐',
    description: '麻辣鲜香的经典川菜',
    ingredients: ['嫩豆腐 400g', '肉末 100g', '豆瓣酱 2勺', '花椒粉 1勺', '葱花 适量'],
    steps: [
      '豆腐切块用盐水焯一下',
      '热锅炒肉末至变色',
      '加豆瓣酱炒出红油',
      '倒入豆腐轻轻翻炒',
      '调味后撒花椒粉',
      '最后撒葱花即可'
    ],
    cookingTime: '20分钟',
    difficulty: '中等',
    tags: ['川菜', '麻辣', '嫩滑'],
    category: '川菜',
    scores: { healthy: 7, difficulty: 5, vegetarian: 4, spicy: 9, sweetness: 3 }
  },
  {
    id: '7',
    name: '清蒸鲈鱼',
    description: '鲜美清淡，营养丰富',
    ingredients: ['鲈鱼 1条', '蒸鱼豉油 3勺', '葱丝 适量', '姜丝 适量', '料酒 2勺'],
    steps: [
      '鲈鱼处理干净，划几刀',
      '用料酒和盐腌制10分钟',
      '摆盘放上姜丝',
      '水开后蒸8-10分钟',
      '倒掉蒸出的水',
      '淋蒸鱼豉油，撒葱丝即可'
    ],
    cookingTime: '25分钟',
    difficulty: '简单',
    tags: ['清蒸', '鲜美', '营养'],
    category: '海鲜',
    scores: { healthy: 9, difficulty: 3, vegetarian: 0, spicy: 0, sweetness: 10 }
  },
  {
    id: '8',
    name: '糖醋排骨',
    description: '酸甜可口，老少皆宜',
    ingredients: ['排骨 500g', '冰糖 50g', '生抽 3勺', '老抽 1勺', '料酒 2勺', '白醋 3勺'],
    steps: [
      '排骨洗净切段焯水',
      '锅中放少量油炒糖色',
      '放入排骨翻炒上色',
      '加入调料和开水焖煮30分钟',
      '大火收汁撒芝麻即可'
    ],
    cookingTime: '45分钟',
    difficulty: '中等',
    tags: ['甜品', '荤菜', '糖醋'],
    category: '家常菜',
    scores: { healthy: 5, difficulty: 6, vegetarian: 1, spicy: 0, sweetness: 8 }
  },
  {
    id: '9',
    name: '鸡蛋豆腐羹',
    description: '嫩滑鲜美，营养丰富的家常汤品',
    ingredients: ['鸡蛋 2个', '嫩豆腐 200g', '香菇 3朵', '胡萝卜丝 适量', '葱花 适量', '盐 适量', '香油 几滴', '生抽 1勺'],
    steps: [
      '豆腐切小块，香菇切片',
      '鸡蛋打散备用',
      '锅中加水烧开，放入豆腐块',
      '加入香菇片和胡萝卜丝煮3分钟',
      '缓慢倒入蛋液，边倒边搅拌成蛋花',
      '调味后撒葱花，淋香油即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['汤羹', '嫩滑', '营养', '清淡'],
    category: '汤品',
    scores: { healthy: 9, difficulty: 2, vegetarian: 7, spicy: 0, sweetness: 10 }
  },
  {
    id: '10',
    name: '豆腐鸡蛋饼',
    description: '香嫩可口，营养均衡的创意煎饼',
    ingredients: ['鸡蛋 3个', '嫩豆腐 150g', '面粉 50g', '胡萝卜丁 适量', '韭菜末 适量', '盐 适量', '胡椒粉 少许'],
    steps: [
      '豆腐压碎成泥状',
      '鸡蛋打散，加入豆腐泥拌匀',
      '加入面粉、胡萝卜丁、韭菜末',
      '调味拌成无颗粒的糊状',
      '平底锅刷油，倒入蛋糊摊成饼',
      '小火煎至两面金黄即可'
    ],
    cookingTime: '20分钟',
    difficulty: '简单',
    tags: ['煎饼', '营养', '创意', '素食'],
    category: '主食',
    scores: { healthy: 8, difficulty: 3, vegetarian: 8, spicy: 0, sweetness: 10 }
  },
  {
    id: '11',
    name: '鸡蛋炒豆腐',
    description: '简单下饭的家常炒菜',
    ingredients: ['鸡蛋 2个', '老豆腐 300g', '青椒 1个', '红椒 半个', '葱花 适量', '生抽 2勺', '盐 适量', '糖 少许'],
    steps: [
      '豆腐切块，青红椒切丁',
      '鸡蛋打散炒熟盛起',
      '锅中放油，下豆腐块煎至微黄',
      '加入青红椒丁炒匀',
      '倒入炒蛋翻炒',
      '调味炒匀，撒葱花即可'
    ],
    cookingTime: '15分钟',
    difficulty: '简单',
    tags: ['家常', '下饭', '营养', '素食'],
    category: '家常菜',
    scores: { healthy: 8, difficulty: 2, vegetarian: 8, spicy: 1, sweetness: 9 }
  }
];