import { useState, useEffect } from 'react';

// 农历计算相关常量和函数
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d526, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  0x14b63
];

// 节气日期数据
const solarTermDates = {
  2024: [
    [1, 6], [1, 20], [2, 4], [2, 19], [3, 5], [3, 20],
    [4, 4], [4, 19], [5, 5], [5, 20], [6, 5], [6, 21],
    [7, 6], [7, 22], [8, 7], [8, 22], [9, 7], [9, 22],
    [10, 8], [10, 23], [11, 7], [11, 22], [12, 6], [12, 21]
  ],
  2025: [
    [1, 5], [1, 20], [2, 3], [2, 18], [3, 5], [3, 20],
    [4, 4], [4, 20], [5, 5], [5, 21], [6, 5], [6, 21],
    [7, 7], [7, 22], [8, 7], [8, 22], [9, 7], [9, 23],
    [10, 8], [10, 23], [11, 7], [11, 22], [12, 7], [12, 21]
  ],
  2026: [
    [1, 5], [1, 20], [2, 3], [2, 18], [3, 5], [3, 20],
    [4, 4], [4, 20], [5, 5], [5, 21], [6, 5], [6, 21],
    [7, 7], [7, 22], [8, 7], [8, 23], [9, 7], [9, 23],
    [10, 8], [10, 23], [11, 7], [11, 22], [12, 7], [12, 21]
  ]
};

// 获取农历信息
function getLunarDate(date: Date) {
  let i, leap = 0, temp = 0;
  const baseDate = new Date(1900, 0, 31);
  let offset = Math.floor((date.getTime() - baseDate.getTime()) / 86400000);

  for (i = 1900; i < 2050 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    i--;
  }

  const year = i;
  leap = leapMonth(year);
  let isLeap = false;

  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(year);
    } else {
      temp = monthDays(year, i);
    }

    if (isLeap && i === leap + 1) {
      isLeap = false;
    }
    
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    --i;
  }
  
  if (offset === 0 && leap > 0 && i === leap) {
      isLeap = true;
  }

  const month = i;
  const day = offset + 1;

  return { year, month, day, isLeap };
}

function lYearDays(year: number) {
  let i, sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(year);
}

function leapDays(year: number) {
  if (leapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function leapMonth(year: number) {
  return lunarInfo[year - 1900] & 0xf;
}

function monthDays(year: number, month: number) {
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

// 获取下一个节气
function getNextSolarTerm(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const solarTerms = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ];
  
  const yearTermDates = solarTermDates[year as keyof typeof solarTermDates] || solarTermDates[2024];
  
  for (let i = 0; i < yearTermDates.length; i++) {
    const [termMonth, termDay] = yearTermDates[i];
    if (termMonth > month || (termMonth === month && termDay > day)) {
      const termDate = new Date(year, termMonth - 1, termDay);
      const daysToTerm = Math.ceil((termDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
      
      return {
        name: solarTerms[i],
        days: daysToTerm
      };
    }
  }
  
  const nextYear = year + 1;
  const nextYearTerms = solarTermDates[nextYear as keyof typeof solarTermDates] || solarTermDates[2025];
  const [nextMonth, nextDay] = nextYearTerms[0];
  const nextTermDate = new Date(nextYear, nextMonth - 1, nextDay);
  const daysToNext = Math.ceil((nextTermDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  
  return {
    name: solarTerms[0],
    days: daysToNext
  };
}

export function DateInfo() {
  const [dateInfo, setDateInfo] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    
    const baseYear = 1984;
    const yearOffset = (year - baseYear) % 60;
    const heavenlyStem = heavenlyStems[yearOffset % 10];
    const earthlyBranch = earthlyBranches[yearOffset % 12];
    const zodiacAnimal = zodiacAnimals[yearOffset % 12];
    
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '冬月', '腊月'];
    
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    const lunarDate = getLunarDate(today);
    const lunarMonthStr = (lunarDate.isLeap ? '闰' : '') + lunarMonths[lunarDate.month - 1];
    const lunarDayStr = lunarDays[lunarDate.day - 1];
    
    const nextSolarTermInfo = getNextSolarTerm(today);
    const nextSolarTerm = nextSolarTermInfo.name;
    const daysToNextTerm = nextSolarTermInfo.days;
    
    const dateString = `今天是${year}年${month}月${day}日 农历${heavenlyStem}${earthlyBranch}${zodiacAnimal}年${lunarMonthStr}${lunarDayStr} 距下一个节气${nextSolarTerm}还有${daysToNextTerm}天`;
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