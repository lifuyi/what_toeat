import { useState, useEffect } from 'react';

export function DateInfo() {
  const [dateInfo, setDateInfo] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // 天干地支和生肖
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    
    // 计算天干地支年份（简化计算，以1984年甲子年为基准）
    const baseYear = 1984; // 甲子年
    const yearOffset = (year - baseYear) % 60;
    const heavenlyStem = heavenlyStems[yearOffset % 10];
    const earthlyBranch = earthlyBranches[yearOffset % 12];
    const zodiacAnimal = zodiacAnimals[yearOffset % 12];
    
    // 农历月份
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '冬月', '腊月'];
    
    // 农历日期
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    // 简化的农历计算（示例数据）
    const lunarMonth = lunarMonths[5]; // 六月
    const lunarDay = lunarDays[15]; // 十六
    
    // 简单的节气计算（示例）
    const solarTerms = [
      '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
      '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
      '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
      '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
    ];
    
    // 获取当前月份对应的节气（简化版）
    const currentSolarTermIndex = Math.floor((month - 1) * 2);
    const nextSolarTerm = solarTerms[(currentSolarTermIndex + 1) % 24];
    
    // 简单计算距离下个节气的天数（示例）
    const daysToNextTerm = Math.floor(Math.random() * 15) + 1; // 临时随机数，实际应该计算
    
    const dateString = `今天是${year}年${month}月${day}日 农历${heavenlyStem}${earthlyBranch}${zodiacAnimal}年${lunarMonth}${lunarDay} 距下一个节气${nextSolarTerm}还有${daysToNextTerm}天`;
    setDateInfo(dateString);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 dark:bg-gradient-to-r dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200">
      <span className="animate-pulse">📅</span>
      <span className="text-sm dark:text-indigo-400 text-indigo-700 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-indigo-400 dark:to-purple-400 bg-gradient-to-r from-indigo-600 to-purple-600">
        {dateInfo}
      </span>
    </div>
  );
}