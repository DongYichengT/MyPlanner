# 🌟 DailyFlow - 个人每日自律打卡系统

专为**运动锻炼**、**法语学习**与**营养摄入**打造的个人每日打卡与习惯追踪网站。无需后端服务，纯前端零编译依赖，数据本地安全加密保存，支持一键部署到个人 **GitHub Pages**，可在手机和电脑上随时打卡记录。

---

## ✨ 核心功能亮点

1. 🏃 **运动锻炼打卡 (Fitness & Sport)**
   - 支持多种运动项目一键切换（跑步、力量训练、瑜伽拉伸、骑行、健走、HIIT等）。
   - 记录锻炼时长（分钟）与热量消耗估算（kcal）。
   - 记录当日训练心得与状态。

2. 🇫🇷 **法语学习打卡 (French Learning)**
   - 学习内容多标签勾选（多邻国、背单词、听力练耳、语法精讲、口语练习、外刊阅读）。
   - 学习时长统计。
   - **每日法语金句 / 词汇 (Mot du jour)**：记录今天学到的法语新词或优美表达。
   - 每日学习心得笔记。

3. 🥗 **营养与健康摄入 (Nutrition & Water)**
   - **8杯水交互追踪 (2000ml 目标)**：点击即可点亮杯子，直观掌握全天补水情况。
   - 饮食结构标签（优质蛋白、丰富蔬菜、控糖少油、多喝温水等）。
   - 今日三餐及加餐明细记录（早餐/午餐/晚餐/加餐）。
   - 补充剂/维生素摄入开关与饮食满意度 5 星自评。

4. ➕ **个性化习惯扩展 (Custom Habits)**
   - 支持自由添加自定义打卡项（如：早睡早起、冥想、阅读20页等），并选择专属图标。

5. 📊 **数据统计与可视化看板 (Analytics & Heatmap)**
   - **GitHub 贡献风格热力图**：呈现最近 24 周的打卡活跃轨迹方块，自律成果一目了然。
   - **连续打卡天数 (Streaks)**：自动计算当前连续天数与历史最高连胜天数，打卡全满更有撒花庆祝特效 🎉。
   - **趋势折线与柱状图 (Chart.js)**：直观展示近 14 天运动与法语学习时间对比，以及饮水量达标走势。

6. 📅 **月度日历与补卡回顾 (Calendar & History)**
   - 类似日历视图，标注每日完成圆点（绿=运动，紫=法语，黄=营养）。
   - 点击任何以往日期即可轻松补卡或回顾。

7. 💾 **数据安全与备份恢复 (Privacy & Backup)**
   - 数据保存在您本地浏览器中（LocalStorage），离线可用，私密安全。
   - 提供**一键导出 JSON 备份**与**一键导入恢复**功能，换设备随时迁移。
   - 内置深色模式（Dark Mode）与浅色模式无缝切换。

---

## 💻 本地预览使用

本项目为纯静态现代网页，**无需安装任何 Node.js 或编译器**：
- 直接在文件管理器中**双击打开 `index.html`**，即可在 Chrome、Safari、Edge 等任何浏览器中即时使用！

---

## 🚀 部署到个人 GitHub Pages 指南 (约 1 分钟)

### 第一步：在 GitHub 创建新仓库
1. 打开 [GitHub](https://github.com/) 并登录。
2. 点击右上角 **`+`** 按钮 ➔ 选择 **New repository**。
3. 填写仓库名称（例如：`daily-checkin` 或 `dailyflow`）。
4. 建议选择 **Public**（公开，免费使用 Pages 服务）。
5. **不要**勾选 "Add a README file"（因为本地已有完备文件）。
6. 点击 **Create repository**。

### 第二步：推送本地代码到 GitHub
在您的 Mac 终端（Terminal）中，运行以下命令（将 `<your-username>` 和 `<your-repo-name>` 替换为您自己的 GitHub 用户名和仓库名）：

```bash
cd /Users/6estates/Desktop/day1

# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件并提交
git add .
git commit -m "feat: initial DailyFlow habit tracker"

# 3. 关联远程分支 (main)
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 4. 推送到 GitHub
git push -u origin main
```

> 💡 **小贴士**：
> - 如果终端提示需要安装开发者工具（xcode-select），按照弹窗点击“安装”即可自动配好 Git。
> - **不想用命令行？** 也可以直接在 GitHub 新建仓库页面点击 **"uploading an existing file"**（上传现有文件），将 `day1` 文件夹中的所有文件直接拖拽上传并 Commit，同样可以 100% 成功部署！


### 第三步：开启 GitHub Pages 网站服务
1. 打开您刚推送好的 GitHub 仓库页面。
2. 点击顶部的 **Settings**（设置）选项卡。
3. 在左侧侧边栏中找到并点击 **Pages**。
4. 在 **Build and deployment** 下的 **Branch** 区域：
   - 将分支选择为 **`main`**。
   - 文件夹选择为 **`/ (root)`**。
   - 点击 **Save**（保存）。
5. 稍等约 20~30 秒刷新该页面，顶部就会显示出您的专属在线网站链接：
   > `Your site is live at https://<your-username>.github.io/<your-repo-name>/`

---

## 📱 手机端体验建议 (添加到手机主屏幕)

为了获得如原生 App 般的打卡体验，您可以将网址添加到手机桌面：
- **iPhone (Safari 浏览器)**：打开网站 ➔ 点击底部中间的 **分享 (Share)** 按钮 ➔ 选择 **“添加到主屏幕” (Add to Home Screen)**。
- **Android (Chrome / 微信 / 系统浏览器)**：打开网站 ➔ 点击右上角菜单 **`⋮`** ➔ 选择 **“添加到主屏幕”** 或 **“安装应用”**。

这样在手机上就能以全屏、无地址栏的原生应用形态一键启动打卡！

---

## 📁 项目结构说明

```
day1/
├── index.html         # 主界面结构 (打卡工作台、统计图表、日历、设置模态框)
├── css/
│   └── style.css      # 玻璃拟态风格、动效、热力图网格、深色模式支持
├── js/
│   ├── store.js       # 本地数据持久化、打卡统计、连续天数、导出导入逻辑
│   ├── components.js  # 运动/法语/营养/自定义卡片渲染与表单交互
│   ├── charts.js      # GitHub 风格热力图与 Chart.js 趋势图表
│   └── app.js         # 页面视图调度、主题切换、事件绑定
├── manifest.json      # PWA 配置文件 (支持移动端免安装添加到主屏幕)
└── README.md          # 详细使用与 GitHub Pages 部署说明文档
```
