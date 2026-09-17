/**
 * DailyFlow - UI Components & Card Renderers
 */

// Toast notification manager
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  toast.className = `toast px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium ${bgColors[type] || bgColors.success}`;
  
  const iconName = type === 'error' ? 'alert-circle' : type === 'info' ? 'info' : 'check-circle-2';
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Celebration Confetti
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/**
 * Render Workout / Fitness Habit Card
 */
function renderSportCard(log, dateKey, isToday) {
  const sport = log.sport || {};
  const isDone = Boolean(sport.completed);
  const workoutTypes = ['跑步', '力量训练', '瑜伽拉伸', '骑行', '轻快健走', '游泳', 'HIIT', '球类运动'];

  return `
    <div class="habit-card glass-card rounded-2xl p-5 border transition-all ${isDone ? 'checked border-emerald-500/40 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'}" id="card-sport">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <i data-lucide="flame" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">运动锻炼</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                ${isDone ? '已达成 ✓' : '待打卡'}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">记录今日汗水与运动消耗</p>
          </div>
        </div>

        <!-- Quick Toggle Checkbox Button -->
        <button onclick="handleToggleHabit('${dateKey}', 'sport')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isDone ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'}">
          <i data-lucide="${isDone ? 'check' : 'circle'}" class="w-4 h-4"></i>
          <span>${isDone ? '已完成' : '点此完成'}</span>
        </button>
      </div>

      <!-- Content Inputs -->
      <div class="space-y-4 pt-1">
        <!-- Workout Type Selectors -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">运动项目</label>
          <div class="flex flex-wrap gap-1.5">
            ${workoutTypes.map(type => `
              <button type="button" onclick="selectSportType('${dateKey}', '${type}')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${sport.type === type ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                ${type}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Duration & Calories Row -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">运动时长 (分钟)</label>
            <div class="relative flex items-center">
              <input type="number" min="0" max="360" step="5" value="${sport.duration || 30}" id="input-sport-duration" onchange="updateSportField('${dateKey}', 'duration', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              <span class="absolute right-3 text-xs text-slate-400 pointer-events-none">min</span>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">预估消耗 (千卡)</label>
            <div class="relative flex items-center">
              <input type="number" min="0" max="3000" placeholder="例如: 300" value="${sport.calories || ''}" id="input-sport-calories" onchange="updateSportField('${dateKey}', 'calories', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              <span class="absolute right-3 text-xs text-slate-400 pointer-events-none">kcal</span>
            </div>
          </div>
        </div>

        <!-- Notes / Thoughts -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">运动感受 / 记录 (可选)</label>
          <input type="text" placeholder="例：晨跑状态极佳，配速 5'30''，膝盖无不适" value="${sport.notes ? escapeHtml(sport.notes) : ''}" onchange="updateSportField('${dateKey}', 'notes', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
        </div>
      </div>
    </div>
  `;
}

/**
 * Render French Learning Habit Card
 */
function renderFrenchCard(log, dateKey, isToday) {
  const french = log.french || {};
  const isDone = Boolean(french.completed);
  const allModules = ['Duolingo', '背单词', '听力练耳', '语法精解', '口语发音', '外刊原版'];
  const currentModules = Array.isArray(french.modules) ? french.modules : [];

  return `
    <div class="habit-card glass-card rounded-2xl p-5 border transition-all ${isDone ? 'checked border-indigo-500/40 bg-indigo-500/5' : 'border-slate-200 dark:border-slate-800'}" id="card-french">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <i data-lucide="languages" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">法语学习</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${isDone ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                ${isDone ? '已达成 ✓' : '待打卡'}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">法语点滴积累，从每日词汇开始</p>
          </div>
        </div>

        <!-- Quick Toggle Button -->
        <button onclick="handleToggleHabit('${dateKey}', 'french')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isDone ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600'}">
          <i data-lucide="${isDone ? 'check' : 'circle'}" class="w-4 h-4"></i>
          <span>${isDone ? '已完成' : '点此完成'}</span>
        </button>
      </div>

      <!-- Inputs -->
      <div class="space-y-4 pt-1">
        <!-- Module Multi-select Chips -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">学习内容 (可多选)</label>
          <div class="flex flex-wrap gap-1.5">
            ${allModules.map(mod => {
              const active = currentModules.includes(mod);
              return `
                <button type="button" onclick="toggleFrenchModule('${dateKey}', '${mod}')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                  ${mod}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Study Duration -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">学习时长 (分钟)</label>
          <div class="relative flex items-center">
            <input type="number" min="0" max="360" step="5" value="${french.duration || 30}" id="input-french-duration" onchange="updateFrenchField('${dateKey}', 'duration', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
            <span class="absolute right-3 text-xs text-slate-400 pointer-events-none">min</span>
          </div>
        </div>

        <!-- Mot du jour (Word / Sentence of the day) -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-400">今日法语金句 / 新词 (Mot du jour)</label>
            <span class="text-[10px] text-indigo-500 font-mono">Français</span>
          </div>
          <input type="text" placeholder="例：C'est la vie! (这就是生活！)" value="${french.word ? escapeHtml(french.word) : ''}" onchange="updateFrenchField('${dateKey}', 'word', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">今日复习笔记 / 收获</label>
          <input type="text" placeholder="例：复习了现在时第一组变位，多邻国连胜 +1" value="${french.notes ? escapeHtml(french.notes) : ''}" onchange="updateFrenchField('${dateKey}', 'notes', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Nutrition Habit Card (with 8-cup water tracker)
 */
function renderNutritionCard(log, dateKey, isToday) {
  const nutrition = log.nutrition || {};
  const isDone = Boolean(nutrition.completed);
  const waterCount = Math.min(8, Math.max(0, Number(nutrition.waterGlasses || 0)));
  const targetMl = 2000;
  const currentMl = waterCount * 250;

  const nutritionTags = ['优质蛋白', '蔬菜充沛', '少油控糖', '多喝温水', '粗粮慢碳', '适度低卡'];
  const currentTags = Array.isArray(nutrition.tags) ? nutrition.tags : [];
  const meals = nutrition.meals || {};

  return `
    <div class="habit-card glass-card rounded-2xl p-5 border transition-all ${isDone ? 'checked border-amber-500/40 bg-amber-500/5' : 'border-slate-200 dark:border-slate-800'}" id="card-nutrition">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <i data-lucide="apple" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">营养与健康摄入</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${isDone ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                ${isDone ? '已达成 ✓' : '待打卡'}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">8杯水充足补水，均衡饮食每一餐</p>
          </div>
        </div>

        <!-- Quick Toggle Button -->
        <button onclick="handleToggleHabit('${dateKey}', 'nutrition')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isDone ? 'bg-amber-600 text-white shadow-sm hover:bg-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'}">
          <i data-lucide="${isDone ? 'check' : 'circle'}" class="w-4 h-4"></i>
          <span>${isDone ? '已完成' : '点此完成'}</span>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4 pt-1">
        <!-- Water Tracker (8 Glasses) -->
        <div class="p-3.5 rounded-xl bg-sky-500/5 dark:bg-sky-950/20 border border-sky-500/20">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <i data-lucide="droplet" class="w-4 h-4 text-sky-500"></i>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200">每日饮水追踪 (8杯 / 2000ml)</span>
            </div>
            <span class="text-xs font-semibold text-sky-600 dark:text-sky-400">${currentMl} / ${targetMl} ml</span>
          </div>

          <!-- Glass Icons Grid -->
          <div class="grid grid-cols-8 gap-1.5 my-2">
            ${Array.from({ length: 8 }).map((_, idx) => {
              const active = idx < waterCount;
              return `
                <button type="button" onclick="setWaterGlass('${dateKey}', ${idx + 1})" class="water-glass-btn flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${active ? 'bg-sky-500 text-white border-sky-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-400'}">
                  <i data-lucide="droplet" class="w-3.5 h-3.5 mb-0.5"></i>
                  <span class="text-[9px] font-mono leading-none">${idx + 1}</span>
                </button>
              `;
            }).join('')}
          </div>
          <div class="flex justify-between items-center text-[11px] text-slate-400 mt-1 px-1">
            <span>点击杯子快速设置杯数</span>
            <button type="button" onclick="setWaterGlass('${dateKey}', 0)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline">重置</button>
          </div>
        </div>

        <!-- Health Food Tags -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">今日饮食结构与习惯</label>
          <div class="flex flex-wrap gap-1.5">
            ${nutritionTags.map(tag => {
              const active = currentTags.includes(tag);
              return `
                <button type="button" onclick="toggleNutritionTag('${dateKey}', '${tag}')" class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}">
                  ${tag}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Supplements & Star Rating Row -->
        <div class="grid grid-cols-2 gap-3 items-center">
          <!-- Supplements Toggle -->
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <input type="checkbox" id="check-supplements" ${nutrition.supplements ? 'checked' : ''} onchange="updateNutritionField('${dateKey}', 'supplements', this.checked)" class="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer" />
            <label for="check-supplements" class="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">补充剂/维生素</label>
          </div>

          <!-- Star Rating -->
          <div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
            <span class="text-xs text-slate-500">饮食满意度</span>
            <div class="flex gap-0.5">
              ${[1, 2, 3, 4, 5].map(star => `
                <button type="button" onclick="updateNutritionField('${dateKey}', 'rating', ${star})" class="text-xs text-amber-400 hover:scale-125 transition-transform">
                  <i data-lucide="star" class="w-3.5 h-3.5 ${star <= (nutrition.rating || 5) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}"></i>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Meals Details Accordion / Inputs -->
        <details class="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-2.5">
          <summary class="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <span class="flex items-center gap-1.5">
              <i data-lucide="utensils" class="w-3.5 h-3.5 text-amber-500"></i>
              记录三餐详情 (可选)
            </span>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform group-open:rotate-180 text-slate-400"></i>
          </summary>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-0.5">早餐</label>
              <input type="text" placeholder="如: 全麦面包+鸡蛋+咖啡" value="${meals.breakfast ? escapeHtml(meals.breakfast) : ''}" onchange="updateMealField('${dateKey}', 'breakfast', this.value)" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-0.5">午餐</label>
              <input type="text" placeholder="如: 鸡胸肉沙拉+糙米" value="${meals.lunch ? escapeHtml(meals.lunch) : ''}" onchange="updateMealField('${dateKey}', 'lunch', this.value)" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-500 mb-0.5">晚餐</label>
              <input type="text" placeholder="如: 清蒸鱼+时蔬" value="${meals.dinner ? escapeHtml(meals.dinner) : ''}" onchange="updateMealField('${dateKey}', 'dinner', this.value)" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none" />
            </div>
          </div>
        </details>
      </div>
    </div>
  `;
}

/**
 * Render Custom Habit Card
 */
function renderCustomCard(habit, log, dateKey) {
  const customData = (log.custom && log.custom[habit.id]) || { completed: false };
  const isDone = Boolean(customData.completed);

  return `
    <div class="habit-card glass-card rounded-2xl p-5 border transition-all ${isDone ? 'checked border-purple-500/40 bg-purple-500/5' : 'border-slate-200 dark:border-slate-800'}" id="card-${habit.id}">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <i data-lucide="${habit.icon || 'sparkles'}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">${escapeHtml(habit.name)}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium ${isDone ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}">
                ${isDone ? '已达成 ✓' : '待打卡'}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${escapeHtml(habit.description || '个人日常好习惯')}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Quick Toggle Button -->
          <button onclick="handleToggleHabit('${dateKey}', '${habit.id}')" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isDone ? 'bg-purple-600 text-white shadow-sm hover:bg-purple-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600'}">
            <i data-lucide="${isDone ? 'check' : 'circle'}" class="w-4 h-4"></i>
            <span>${isDone ? '已完成' : '点此完成'}</span>
          </button>

          <!-- Delete custom habit button -->
          <button onclick="confirmDeleteCustomHabit('${habit.id}')" title="删除此习惯" class="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Daily Reflection / Journal card
 */
function renderDailyReflection(log, dateKey) {
  return `
    <div class="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2 mb-2">
        <i data-lucide="book-heart" class="w-4 h-4 text-pink-500"></i>
        <h4 class="text-xs font-bold text-slate-700 dark:text-slate-200">今日总结与随想 (Reflection)</h4>
      </div>
      <textarea rows="2" placeholder="写下一句话记录今天的状态、感悟或值得感谢的事..." onchange="updateReflection('${dateKey}', this.value)" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/40 resize-none">${log.reflection ? escapeHtml(log.reflection) : ''}</textarea>
    </div>
  `;
}

// Security helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
