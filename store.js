/**
 * DailyFlow - Store Management Layer
 * Handles LocalStorage persistence, habit schema, streak calculation, and data export/import.
 */

const STORAGE_KEYS = {
  HABITS: 'dailyflow_habits',
  LOGS: 'dailyflow_logs',
  THEME: 'dailyflow_theme',
  SETTINGS: 'dailyflow_settings'
};

// Default pre-configured habits
const DEFAULT_HABITS = [
  {
    id: 'sport',
    name: '运动锻炼',
    icon: 'flame',
    color: 'emerald',
    badge: 'Fitness',
    description: '跑步、健身、瑜伽与体能训练'
  },
  {
    id: 'french',
    name: '法语学习',
    icon: 'languages',
    color: 'indigo',
    badge: 'Français',
    description: '多邻国打卡、背单词、听力与语法'
  },
  {
    id: 'nutrition',
    name: '营养摄入',
    icon: 'apple',
    color: 'amber',
    badge: 'Nutrition',
    description: '健康三餐、8杯水追踪与均衡饮食'
  }
];

class DailyStore {
  constructor() {
    this.habits = this.loadHabits();
    this.logs = this.loadLogs();
  }

  // Helper: Get local Date string YYYY-MM-DD
  static getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static parseDateKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  loadHabits() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse habits from localStorage', e);
    }
    this.saveHabits(DEFAULT_HABITS);
    return [...DEFAULT_HABITS];
  }

  saveHabits(habits) {
    this.habits = habits;
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }

  loadLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) {
        return JSON.parse(stored) || {};
      }
    } catch (e) {
      console.warn('Failed to parse logs from localStorage', e);
    }
    return {};
  }

  saveLogs(logs) {
    this.logs = logs;
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  }

  getHabits() {
    return this.habits;
  }

  addCustomHabit(name, icon = 'sparkles', color = 'purple', description = '') {
    const newHabit = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      icon: icon || 'sparkles',
      color: color || 'purple',
      badge: 'Custom',
      description: description.trim() || '自定义习惯',
      isCustom: true
    };
    this.habits.push(newHabit);
    this.saveHabits(this.habits);
    return newHabit;
  }

  deleteCustomHabit(id) {
    this.habits = this.habits.filter(h => h.id !== id);
    this.saveHabits(this.habits);
  }

  // Get log for a specific date (defaults to empty template)
  getLog(dateKey) {
    if (!this.logs[dateKey]) {
      return {
        date: dateKey,
        completedHabits: [],
        sport: {
          completed: false,
          type: '跑步',
          duration: 30,
          calories: '',
          notes: ''
        },
        french: {
          completed: false,
          modules: ['Duolingo', '单词'],
          duration: 30,
          word: '',
          notes: ''
        },
        nutrition: {
          completed: false,
          waterGlasses: 0,
          meals: { breakfast: '', lunch: '', dinner: '', snack: '' },
          tags: ['优质蛋白', '蔬菜充沛'],
          supplements: false,
          rating: 4,
          notes: ''
        },
        custom: {},
        reflection: '',
        updatedAt: null
      };
    }
    // Ensure all standard fields exist
    const log = this.logs[dateKey];
    return {
      date: dateKey,
      completedHabits: log.completedHabits || [],
      sport: {
        completed: false,
        type: '跑步',
        duration: 30,
        calories: '',
        notes: '',
        ...(log.sport || {})
      },
      french: {
        completed: false,
        modules: ['Duolingo', '单词'],
        duration: 30,
        word: '',
        notes: '',
        ...(log.french || {})
      },
      nutrition: {
        completed: false,
        waterGlasses: 0,
        meals: { breakfast: '', lunch: '', dinner: '', snack: '' },
        tags: ['优质蛋白', '蔬菜充沛'],
        supplements: false,
        rating: 4,
        notes: '',
        ...(log.nutrition || {})
      },
      custom: log.custom || {},
      reflection: log.reflection || '',
      updatedAt: log.updatedAt || null
    };
  }

  // Save log for date
  updateLog(dateKey, partialData) {
    const current = this.getLog(dateKey);
    const updated = {
      ...current,
      ...partialData,
      date: dateKey,
      updatedAt: new Date().toISOString()
    };

    // Recompute completedHabits array
    const completed = [];
    if (updated.sport && updated.sport.completed) completed.push('sport');
    if (updated.french && updated.french.completed) completed.push('french');
    if (updated.nutrition && updated.nutrition.completed) completed.push('nutrition');

    if (updated.custom) {
      for (const [cid, cData] of Object.entries(updated.custom)) {
        if (cData && cData.completed) completed.push(cid);
      }
    }

    updated.completedHabits = completed;

    this.logs[dateKey] = updated;
    this.saveLogs(this.logs);
    return updated;
  }

  // Quick toggle habit completion
  toggleHabit(dateKey, habitId, isCompleted) {
    const log = this.getLog(dateKey);
    if (habitId === 'sport') {
      log.sport.completed = isCompleted !== undefined ? isCompleted : !log.sport.completed;
    } else if (habitId === 'french') {
      log.french.completed = isCompleted !== undefined ? isCompleted : !log.french.completed;
    } else if (habitId === 'nutrition') {
      log.nutrition.completed = isCompleted !== undefined ? isCompleted : !log.nutrition.completed;
    } else {
      if (!log.custom[habitId]) log.custom[habitId] = { completed: false };
      log.custom[habitId].completed = isCompleted !== undefined ? isCompleted : !log.custom[habitId].completed;
    }
    return this.updateLog(dateKey, log);
  }

  // Streak calculation
  getStreaks() {
    const dates = Object.keys(this.logs)
      .filter(d => {
        const log = this.logs[d];
        return log && Array.isArray(log.completedHabits) && log.completedHabits.length > 0;
      })
      .sort();

    if (dates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
    }

    const dateSet = new Set(dates);
    const today = DailyStore.getDateKey(new Date());
    const yesterday = DailyStore.getDateKey(new Date(Date.now() - 86400000));

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();
    
    // If today is not checked in, see if yesterday was checked in
    if (!dateSet.has(today)) {
      if (dateSet.has(yesterday)) {
        checkDate = new Date(Date.now() - 86400000);
      } else {
        checkDate = null;
      }
    }

    if (checkDate) {
      while (true) {
        const key = DailyStore.getDateKey(checkDate);
        if (dateSet.has(key)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    for (const dStr of dates) {
      const curDate = DailyStore.parseDateKey(dStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curDate - prevDate) / 86400000);
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      prevDate = curDate;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      totalDays: dates.length
    };
  }

  // Overall Statistics
  getStats() {
    let totalSportMinutes = 0;
    let totalFrenchMinutes = 0;
    let totalWaterGlasses = 0;
    let totalCheckins = 0;
    let sportDays = 0;
    let frenchDays = 0;
    let nutritionDays = 0;

    for (const dateKey in this.logs) {
      const log = this.logs[dateKey];
      if (!log) continue;

      if (log.completedHabits && log.completedHabits.length > 0) {
        totalCheckins++;
      }

      if (log.sport && log.sport.completed) {
        sportDays++;
        totalSportMinutes += Number(log.sport.duration || 0);
      }

      if (log.french && log.french.completed) {
        frenchDays++;
        totalFrenchMinutes += Number(log.french.duration || 0);
      }

      if (log.nutrition && log.nutrition.completed) {
        nutritionDays++;
      }

      if (log.nutrition && log.nutrition.waterGlasses) {
        totalWaterGlasses += Number(log.nutrition.waterGlasses || 0);
      }
    }

    const streaks = this.getStreaks();

    return {
      totalCheckins,
      sportDays,
      frenchDays,
      nutritionDays,
      totalSportMinutes,
      totalFrenchMinutes,
      totalWaterGlasses,
      ...streaks
    };
  }

  // Export all data to JSON
  exportData() {
    const payload = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      habits: this.habits,
      logs: this.logs
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dailyflow_backup_${DailyStore.getDateKey()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Import data from JSON
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          if (content.logs && typeof content.logs === 'object') {
            this.logs = { ...this.logs, ...content.logs };
            this.saveLogs(this.logs);
          }
          if (content.habits && Array.isArray(content.habits)) {
            // merge habits preserving custom ones
            const existingIds = new Set(this.habits.map(h => h.id));
            for (const h of content.habits) {
              if (!existingIds.has(h.id)) {
                this.habits.push(h);
              }
            }
            this.saveHabits(this.habits);
          }
          resolve(true);
        } catch (err) {
          reject(new Error('数据格式错误，请导入有效的 DailyFlow 备份文件'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }

  // Reset all data
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    this.habits = [...DEFAULT_HABITS];
    this.logs = {};
    this.saveHabits(this.habits);
    this.saveLogs(this.logs);
  }

  // Seed sample data for demonstration / initial testing
  seedDemoData() {
    const today = new Date();
    const demoLogs = {};

    const sportTypes = ['户外慢跑 5km', '力量训练 (胸背)', '普拉提与拉伸', 'HIIT高强度间歇', '轻快健走'];
    const frenchWords = [
      { word: 'C’est la vie', notes: '这就是生活！日常感叹' },
      { word: 'Petit à petit, l’oiseau fait son nid', notes: '滴水穿石，积少成多' },
      { word: 'Bonjour le monde', notes: '世界你好，基本问候' },
      { word: 'Bon courage!', notes: '加油！祝你好运' },
      { word: 'Prendre le temps', notes: '花时间，从容不迫' }
    ];

    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = DailyStore.getDateKey(d);

      const sportDone = i !== 4 && i !== 11;
      const frenchDone = i !== 2 && i !== 8;
      const nutritionDone = i !== 5;

      const completed = [];
      if (sportDone) completed.push('sport');
      if (frenchDone) completed.push('french');
      if (nutritionDone) completed.push('nutrition');

      const wordObj = frenchWords[i % frenchWords.length];

      demoLogs[key] = {
        date: key,
        completedHabits: completed,
        sport: {
          completed: sportDone,
          type: sportTypes[i % sportTypes.length],
          duration: sportDone ? [30, 45, 60, 40][i % 4] : 0,
          calories: sportDone ? [260, 380, 450, 310][i % 4] : '',
          notes: sportDone ? '状态良好，心率维持在有氧区间' : '休息日'
        },
        french: {
          completed: frenchDone,
          modules: ['Duolingo', '背单词', '听力练耳'],
          duration: frenchDone ? [25, 35, 45, 30][i % 4] : 0,
          word: frenchDone ? wordObj.word : '',
          notes: frenchDone ? wordObj.notes : ''
        },
        nutrition: {
          completed: nutritionDone,
          waterGlasses: nutritionDone ? [6, 7, 8, 8][i % 4] : 4,
          meals: {
            breakfast: '全麦燕麦片 + 水煮蛋 + 黑咖啡',
            lunch: '香煎鸡胸肉配西兰花 + 紫薯',
            dinner: '番茄牛腩汤 + 凉拌时蔬',
            snack: '坚果一小把 + 无糖酸奶'
          },
          tags: ['优质蛋白', '蔬菜充沛', '少油控糖'],
          supplements: nutritionDone,
          rating: nutritionDone ? 5 : 3,
          notes: nutritionDone ? '饮食清爽均衡，饮水量达标' : '喝水偏少'
        },
        custom: {},
        reflection: i === 0 ? '今天也是元气满满的一天！' : '坚持带来改变。',
        updatedAt: d.toISOString()
      };
    }

    this.logs = { ...demoLogs, ...this.logs };
    this.saveLogs(this.logs);
  }
}

// Global singleton instance
window.dailyStore = new DailyStore();
