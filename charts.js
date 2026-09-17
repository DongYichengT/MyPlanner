/**
 * DailyFlow - Analytics, GitHub Heatmap & Charts
 */

let durationChartInstance = null;
let nutritionChartInstance = null;

/**
 * Render GitHub-style Activity Contribution Heatmap
 */
function renderHeatmap(containerId = 'heatmap-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const logs = window.dailyStore.logs;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  // Display last 24 weeks (approx 168 days) aligned to Sunday
  const totalDays = 24 * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays);
  startDate.setHours(0, 0, 0, 0);
  // Align start to Sunday (0)
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const dayCells = [];
  const curDate = new Date(startDate);

  while (curDate <= today) {
    const key = DailyStore.getDateKey(curDate);
    const log = logs[key];
    const completedCount = (log && Array.isArray(log.completedHabits)) ? log.completedHabits.length : 0;
    
    let level = 0;
    if (completedCount === 1) level = 1;
    else if (completedCount === 2) level = 2;
    else if (completedCount === 3) level = 3;
    else if (completedCount >= 4) level = 4;

    const formattedDate = `${curDate.getFullYear()}年${curDate.getMonth() + 1}月${curDate.getDate()}日`;
    const tooltipText = `${formattedDate}：完成 ${completedCount} 项习惯打卡`;

    dayCells.push(`
      <div 
        class="heatmap-cell level-${level}" 
        title="${tooltipText}" 
        data-date="${key}" 
        onclick="navigateToDate('${key}')">
      </div>
    `);

    curDate.setDate(curDate.getDate() + 1);
  }

  container.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span class="font-medium">最近 24 周自律打卡轨迹</span>
        <div class="flex items-center gap-1.5 text-[11px]">
          <span>少</span>
          <span class="w-2.5 h-2.5 rounded-sm level-0 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-sm level-1 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-sm level-2 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-sm level-3 inline-block"></span>
          <span class="w-2.5 h-2.5 rounded-sm level-4 inline-block"></span>
          <span>多</span>
        </div>
      </div>
      <div class="heatmap-grid p-2 bg-slate-50/70 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
        ${dayCells.join('')}
      </div>
    </div>
  `;
}

/**
 * Render Trend Charts (Sport & French Study)
 */
function renderCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';

  // Extract last 14 days data
  const labels = [];
  const sportData = [];
  const frenchData = [];
  const waterData = [];

  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = DailyStore.getDateKey(d);
    const log = window.dailyStore.getLog(key);

    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    labels.push(label);

    sportData.push((log.sport && log.sport.completed) ? Number(log.sport.duration || 0) : 0);
    frenchData.push((log.french && log.french.completed) ? Number(log.french.duration || 0) : 0);
    waterData.push(Number(log.nutrition?.waterGlasses || 0));
  }

  // 1. Duration Chart (Sport vs French)
  const durationCanvas = document.getElementById('chart-duration');
  if (durationCanvas && window.Chart) {
    if (durationChartInstance) {
      durationChartInstance.destroy();
    }

    durationChartInstance = new Chart(durationCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '运动时长 (分钟)',
            data: sportData,
            backgroundColor: 'rgba(16, 185, 129, 0.75)',
            borderColor: '#10b981',
            borderRadius: 6,
            borderWidth: 1,
            barPercentage: 0.7
          },
          {
            label: '法语学习 (分钟)',
            data: frenchData,
            backgroundColor: 'rgba(99, 102, 241, 0.75)',
            borderColor: '#6366f1',
            borderRadius: 6,
            borderWidth: 1,
            barPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { size: 11 } }
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: 'transparent' },
            ticks: { color: textColor, font: { size: 10 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10 } }
          }
        }
      }
    });
  }

  // 2. Nutrition & Water Intake Chart
  const waterCanvas = document.getElementById('chart-water');
  if (waterCanvas && window.Chart) {
    if (nutritionChartInstance) {
      nutritionChartInstance.destroy();
    }

    nutritionChartInstance = new Chart(waterCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '饮水量 (杯 / 250ml)',
            data: waterData,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.15)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#0284c7',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'transparent' },
            ticks: { color: textColor, font: { size: 10 } }
          },
          y: {
            min: 0,
            max: 8,
            grid: { color: gridColor },
            ticks: {
              stepSize: 2,
              color: textColor,
              font: { size: 10 },
              callback: (val) => `${val}杯`
            }
          }
        }
      }
    });
  }
}

/**
 * Render Overview Summary Stats
 */
function renderStatsCards() {
  const stats = window.dailyStore.getStats();

  const elCurrentStreak = document.getElementById('stat-current-streak');
  const elLongestStreak = document.getElementById('stat-longest-streak');
  const elTotalDays = document.getElementById('stat-total-days');
  const elTotalSport = document.getElementById('stat-total-sport');
  const elTotalFrench = document.getElementById('stat-total-french');
  const elTotalWater = document.getElementById('stat-total-water');

  if (elCurrentStreak) elCurrentStreak.textContent = `${stats.currentStreak} 天`;
  if (elLongestStreak) elLongestStreak.textContent = `${stats.longestStreak} 天`;
  if (elTotalDays) elTotalDays.textContent = `${stats.totalDays} 天`;
  if (elTotalSport) elTotalSport.textContent = `${Math.round(stats.totalSportMinutes / 60 * 10) / 10} 小时`;
  if (elTotalFrench) elTotalFrench.textContent = `${Math.round(stats.totalFrenchMinutes / 60 * 10) / 10} 小时`;
  if (elTotalWater) elTotalWater.textContent = `${(stats.totalWaterGlasses * 0.25).toFixed(1)} L`;
}
