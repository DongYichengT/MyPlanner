/**
 * DailyFlow - Main Application Controller
 */

let activeDateKey = DailyStore.getDateKey();
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); // 0-indexed

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  renderApp();
  initCustomHabitModal();
});

/**
 * Initialize theme (dark/light)
 */
function initTheme() {
  const savedTheme = localStorage.getItem('dailyflow_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('dailyflow_theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
  // Re-render charts with new theme colors
  if (document.getElementById('view-analytics').classList.contains('hidden') === false) {
    renderCharts();
  }
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = isDark 
      ? '<i data-lucide="sun" class="w-4 h-4 text-amber-400"></i>' 
      : '<i data-lucide="moon" class="w-4 h-4 text-slate-600"></i>';
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Navigation Tabs
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  const views = ['today', 'analytics', 'calendar', 'settings'];
  views.forEach(v => {
    const viewEl = document.getElementById(`view-${v}`);
    if (viewEl) {
      if (v === tabId) {
        viewEl.classList.remove('hidden');
      } else {
        viewEl.classList.add('hidden');
      }
    }
  });

  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
      btn.classList.remove('text-slate-500', 'border-transparent');
    } else {
      btn.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
      btn.classList.add('text-slate-500', 'border-transparent');
    }
  });

  if (tabId === 'analytics') {
    renderHeatmap();
    renderStatsCards();
    setTimeout(() => renderCharts(), 50);
  } else if (tabId === 'calendar') {
    renderCalendar();
  } else if (tabId === 'today') {
    renderTodayDashboard();
  }

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Main App Render Dispatcher
 */
function renderApp() {
  renderTodayDashboard();
  renderCalendar();
  renderHeatmap();
  renderStatsCards();
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Render Today's Dashboard View
 */
function renderTodayDashboard() {
  const container = document.getElementById('today-habits-container');
  if (!container) return;

  const log = window.dailyStore.getLog(activeDateKey);
  const habits = window.dailyStore.getHabits();
  const streaks = window.dailyStore.getStreaks();
  const isToday = activeDateKey === DailyStore.getDateKey();

  // Update date header display
  const dateObj = DailyStore.parseDateKey(activeDateKey);
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ${weekdays[dateObj.getDay()]}`;

  const headerDateEl = document.getElementById('today-header-date');
  if (headerDateEl) {
    headerDateEl.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${formattedDate}</span>
        ${isToday ? '<span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold">今日</span>' : '<span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold">补卡/历史查看</span>'}
      </div>
    `;
  }

  // Header Streak Badge
  const headerStreakEl = document.getElementById('header-streak-badge');
  if (headerStreakEl) {
    headerStreakEl.innerHTML = `
      <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold">
        <i data-lucide="flame" class="w-4 h-4 animate-flame"></i>
        <span>连续 ${streaks.currentStreak} 天</span>
      </div>
    `;
  }

  // Calculate today completion progress
  const totalHabits = habits.length;
  const completedCount = log.completedHabits ? log.completedHabits.length : 0;
  const progressPercent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  const progressEl = document.getElementById('today-progress-bar');
  const progressTextEl = document.getElementById('today-progress-text');
  if (progressEl) progressEl.style.width = `${progressPercent}%`;
  if (progressTextEl) progressTextEl.textContent = `${completedCount}/${totalHabits} 项完成 (${progressPercent}%)`;

  // Render cards
  let cardsHtml = '';

  // 1. Sport
  cardsHtml += renderSportCard(log, activeDateKey, isToday);
  // 2. French
  cardsHtml += renderFrenchCard(log, activeDateKey, isToday);
  // 3. Nutrition
  cardsHtml += renderNutritionCard(log, activeDateKey, isToday);

  // 4. Custom Habits
  const customHabits = habits.filter(h => h.isCustom);
  for (const ch of customHabits) {
    cardsHtml += renderCustomCard(ch, log, activeDateKey);
  }

  // 5. Daily Reflection
  cardsHtml += renderDailyReflection(log, activeDateKey);

  container.innerHTML = cardsHtml;
  if (window.lucide) window.lucide.createIcons();
}

/**
 * Habit Interaction Handlers
 */
function handleToggleHabit(dateKey, habitId) {
  const updated = window.dailyStore.toggleHabit(dateKey, habitId);
  const habits = window.dailyStore.getHabits();
  
  const isAllDone = updated.completedHabits && updated.completedHabits.length >= habits.length;
  if (isAllDone) {
    triggerConfetti();
    showToast('太棒了！今日所有打卡目标均已达成！🎉', 'success');
  } else {
    showToast('打卡状态已更新', 'success');
  }

  renderTodayDashboard();
  renderHeatmap();
  renderStatsCards();
}

function selectSportType(dateKey, type) {
  const log = window.dailyStore.getLog(dateKey);
  log.sport.type = type;
  window.dailyStore.updateLog(dateKey, log);
  renderTodayDashboard();
}

function updateSportField(dateKey, field, value) {
  const log = window.dailyStore.getLog(dateKey);
  log.sport[field] = value;
  window.dailyStore.updateLog(dateKey, log);
}

function toggleFrenchModule(dateKey, mod) {
  const log = window.dailyStore.getLog(dateKey);
  let modules = log.french.modules || [];
  if (modules.includes(mod)) {
    modules = modules.filter(m => m !== mod);
  } else {
    modules.push(mod);
  }
  log.french.modules = modules;
  window.dailyStore.updateLog(dateKey, log);
  renderTodayDashboard();
}

function updateFrenchField(dateKey, field, value) {
  const log = window.dailyStore.getLog(dateKey);
  log.french[field] = value;
  window.dailyStore.updateLog(dateKey, log);
}

function setWaterGlass(dateKey, count) {
  const log = window.dailyStore.getLog(dateKey);
  log.nutrition.waterGlasses = count;
  window.dailyStore.updateLog(dateKey, log);
  renderTodayDashboard();
  showToast(`今日饮水量：${count * 250} ml`, 'info');
}

function toggleNutritionTag(dateKey, tag) {
  const log = window.dailyStore.getLog(dateKey);
  let tags = log.nutrition.tags || [];
  if (tags.includes(tag)) {
    tags = tags.filter(t => t !== tag);
  } else {
    tags.push(tag);
  }
  log.nutrition.tags = tags;
  window.dailyStore.updateLog(dateKey, log);
  renderTodayDashboard();
}

function updateNutritionField(dateKey, field, value) {
  const log = window.dailyStore.getLog(dateKey);
  log.nutrition[field] = value;
  window.dailyStore.updateLog(dateKey, log);
  if (field === 'rating') renderTodayDashboard();
}

function updateMealField(dateKey, mealType, value) {
  const log = window.dailyStore.getLog(dateKey);
  if (!log.nutrition.meals) log.nutrition.meals = {};
  log.nutrition.meals[mealType] = value;
  window.dailyStore.updateLog(dateKey, log);
}

function updateReflection(dateKey, value) {
  const log = window.dailyStore.getLog(dateKey);
  log.reflection = value;
  window.dailyStore.updateLog(dateKey, log);
  showToast('心得随想已保存', 'info');
}

/**
 * Date Switcher
 */
function changeDate(offsetDays) {
  const cur = DailyStore.parseDateKey(activeDateKey);
  cur.setDate(cur.getDate() + offsetDays);
  activeDateKey = DailyStore.getDateKey(cur);
  renderTodayDashboard();
}

function jumpToToday() {
  activeDateKey = DailyStore.getDateKey();
  renderTodayDashboard();
}

function navigateToDate(dateKey) {
  activeDateKey = dateKey;
  switchTab('today');
}

/**
 * Calendar View Renderer
 */
function renderCalendar() {
  const titleEl = document.getElementById('calendar-month-title');
  const gridEl = document.getElementById('calendar-days-grid');
  if (!gridEl) return;

  if (titleEl) {
    titleEl.textContent = `${calendarYear}年 ${calendarMonth + 1}月`;
  }

  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const todayKey = DailyStore.getDateKey();

  let cellsHtml = '';

  // Empty cells before month start
  for (let i = 0; i < firstDay; i++) {
    cellsHtml += '<div class="calendar-cell opacity-0 pointer-events-none"></div>';
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(calendarYear, calendarMonth, day);
    const key = DailyStore.getDateKey(d);
    const log = window.dailyStore.logs[key];
    const isSelected = key === activeDateKey;
    const isCurrentDay = key === todayKey;

    const hasSport = log?.sport?.completed;
    const hasFrench = log?.french?.completed;
    const hasNutrition = log?.nutrition?.completed;
    const totalDone = log?.completedHabits?.length || 0;

    cellsHtml += `
      <div 
        class="calendar-cell p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/60 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30' : ''} ${isCurrentDay ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}"
        onclick="navigateToDate('${key}')"
      >
        <span class="text-xs mb-1">${day}</span>
        <div class="flex items-center gap-0.5 h-1.5">
          ${hasSport ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' : ''}
          ${hasFrench ? '<span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>' : ''}
          ${hasNutrition ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>' : ''}
          ${!hasSport && !hasFrench && !hasNutrition && totalDone > 0 ? '<span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>' : ''}
        </div>
      </div>
    `;
  }

  gridEl.innerHTML = cellsHtml;
}

function prevCalendarMonth() {
  calendarMonth--;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }
  renderCalendar();
}

function nextCalendarMonth() {
  calendarMonth++;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  }
  renderCalendar();
}

/**
 * Custom Habit Modal & Actions
 */
function initCustomHabitModal() {
  const openBtn = document.getElementById('btn-open-custom-habit');
  const modal = document.getElementById('modal-custom-habit');
  const closeBtn = document.getElementById('btn-close-modal');
  const form = document.getElementById('form-custom-habit');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custom-habit-name').value;
      const desc = document.getElementById('custom-habit-desc').value;
      const icon = document.getElementById('custom-habit-icon').value || 'sparkles';

      if (!name.trim()) return;

      window.dailyStore.addCustomHabit(name, icon, 'purple', desc);
      form.reset();
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      renderTodayDashboard();
      showToast('已添加新习惯！', 'success');
    });
  }
}

function confirmDeleteCustomHabit(id) {
  if (confirm('确定要删除这个自定义习惯吗？此操作不可撤销。')) {
    window.dailyStore.deleteCustomHabit(id);
    renderTodayDashboard();
    showToast('已删除该习惯', 'info');
  }
}

/**
 * Settings & Backup Handlers
 */
function handleExportData() {
  window.dailyStore.exportData();
  showToast('备份数据已导出！请妥善保存', 'success');
}

function handleImportData(event) {
  const file = event.target.files[0];
  if (!file) return;

  window.dailyStore.importData(file)
    .then(() => {
      renderApp();
      showToast('数据恢复成功！', 'success');
      event.target.value = '';
    })
    .catch(err => {
      showToast(err.message, 'error');
      event.target.value = '';
    });
}

function handleSeedDemo() {
  if (confirm('这将在您本地填充过去两周的演示打卡记录，方便查看热力图和统计图表。确定填充吗？')) {
    window.dailyStore.seedDemoData();
    renderApp();
    showToast('已载入演示数据！可切换到统计与日历看板查看', 'success');
  }
}

function handleResetAll() {
  if (confirm('警告：此操作将清空所有本地打卡数据并恢复初始状态，确定继续吗？')) {
    window.dailyStore.resetAll();
    renderApp();
    showToast('数据已重置为初始状态', 'info');
  }
}
