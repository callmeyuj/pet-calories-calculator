# uki oki 宠物热量计算器 — 项目记忆

> 每次新会话开始时，请先阅读本文件了解项目进展。

---

## 项目概述

纯前端项目（HTML + CSS + JS），无框架依赖。
功能：引导用户选择宠物信息，计算每日建议摄入热量（MER），并给出 uki oki 品牌鲜食喂食建议。

核心文件：
- `index.html` — 页面结构（静态步骤 step-0~3 + step-9~10，动态步骤 step-4~8 由 JS 生成）
- `style.css` — 样式（完整 CSS 变量系统、响应式、无障碍适配）
- `script.js` — 逻辑（状态管理、系数推导链、动态步骤生成、喂食量计算）
- `harness.md` — 迭代行为规范（Plan 模式优先、分步执行、版本管理）
- `CHANGELOG.md` — 版本记录

---

## 核心计算逻辑（不可随意改动）

### 公式链

```
RER = 70 × 体重(kg)^0.75
MER = RER × 推导系数
建议喂食包数 = (MER × 0.95) ÷ 单包热量
```

### 系数推导规则

**犬（5 条规则，顺序执行）：**
1. 运动+绝育：轻度绝育 1.2 / 轻度未绝育 1.4 / 中度绝育 1.6 / 中度未绝育 1.8 / 高强度 2.0
2. 体型：严重超重 1.0 / 超重 1.2 / 偏瘦 2.0 / 正常继承
3. 年龄：宝宝 3.0 / 幼犬 2.0 / 老年 1.2 / 成年继承
4. 孕哺：怀孕 1.8 / 哺乳 2.0 / 非孕继承
5. 术后：绝育术后 1.4 / 其他术后 1.0 / 健康继承

**猫（6 条规则，顺序执行）：**
1. 绝育：已绝育 1.2 / 未绝育 1.4
2. 户外：是 1.6 / 否继承
3. 体型：严重超重 0.9 / 偏瘦 1.4 / 正常继承
4. 年龄：宝宝 2.7 / 幼猫 2.0 / 老年 1.0 / 成年继承
5. 怀孕：是 2.5 / 否继承
6. 术后：绝育术后 1.2 / 其他术后 1.0 / 健康继承

**继承规则**：如果当前规则无匹配条件，沿用上一条规则的系数值。

### 步骤流程

```
Step 0: 宠物类型 → Step 1: 体重 → Step 2: 性别 → Step 3: 绝育
→ Step 4: 运动/户外 → Step 5: 体型 → Step 6: 年龄
→ Step 7: 孕哺（仅成年/老年未绝育母犬母猫）→ Step 8: 术后
→ Step 9: 结果页 → Step 10: 喂食量页
```

### 产品数据（不可改动）

| 宠物 | 产品 | 克数 | 热量 |
|------|------|------|------|
| 犬 | 鸡肉鳕鱼/猪肉蓝莓/嫩牛牡蛎/野牧鹿肉/平均 | 120g | 121/149/144/154/142 kcal |
| 猫 | 鸡肉鳕鱼/猪肉蓝莓/嫩牛牡蛎/野牧鹿肉/平均 | 80g | 107/111/127/132/119 kcal |

---

## 代码架构要点

### 状态管理

```javascript
let state = {
    petType: null,      // 'dog' | 'cat'
    weight: null,       // number (kg)
    gender: null,       // 'male' | 'female'
    neutered: null,     // 'yes' | 'no'
    exercise: null,     // 'light' | 'moderate' | 'high'（犬）
    outdoor: null,      // 'yes' | 'no'（猫）
    bodyCondition: null,// 'severe' | 'overweight' | 'normal' | 'thin'
    age: null,          // 'baby' | 'kid/young' | 'adult' | 'senior'
    pregnant: null,     // 'early' | 'late' | 'none' | 'yes' | 'no'
    postSurgery: null   // 'spay' | 'other' | 'none'
};
```

### 关键函数

| 函数 | 作用 | 文件 |
|------|------|------|
| `initDynamicSteps()` | 动态生成 step-4~8 的 HTML 结构 | script.js |
| `initFireflies()` | 动态生成萤火虫装饰元素 | script.js |
| `createPostSurgeryRule()` | 规则工厂函数，生成术后恢复规则 | script.js |
| `calculateCoefficient()` | 执行系数推导链，返回 `{coeff, note, trail}` | script.js |
| `showResult()` | 计算 RER/MER 并渲染结果页 | script.js |
| `renderBrandSuggestions()` | 渲染 uki oki 喂食建议表 | script.js |
| `renderStepOptions(stepNum)` | 渲染动态步骤的标题/描述/选项 | script.js |
| `selectPet(type)` | 选择宠物类型，启用下一步按钮 | script.js |
| `selectOption(step, key, value)` | 选择选项卡片，更新状态 | script.js |
| `showStep(stepNum)` | 切换步骤，触发动画和配置 | script.js |
| `restart()` | 重置所有状态，回到 Step 0 | script.js |

### 动态步骤配置

步骤 4-8 由 `STEP_CONFIGS` 配置驱动，`initDynamicSteps()` 在页面加载时生成 HTML：

```javascript
// 新增步骤只需在此添加配置
const STEP_CONFIGS = {
    4: { dog: {...}, cat: {...} },  // 运动/户外
    5: { dog: {...}, cat: {...} },  // 体型
    6: { dog: {...}, cat: {...} },  // 年龄
    7: { dog: {...}, cat: {...} },  // 孕哺
    8: { dog: {...}, get cat() {...} }  // 术后（用 getter 复用配置）
};
```

### CSS 变量系统

```css
:root {
    /* 品牌色 */
    --brand-dark, --brand-green, --brand-yellow, ...
    /* 间距 */
    --space-xs: 4px, --space-sm: 8px, --space-md: 16px, ...
    /* 圆角 */
    --radius-sm: 6px, --radius-md: 12px, ...
    /* 过渡 */
    --transition-fast: 0.2s, --transition-base: 0.3s, ...
}

/* 公共工具类 */
.text-gradient-brand { ... }  /* 渐变文字 */
.input-suffix { ... }         /* 输入框单位定位 */
```

### CSS 变量体系

```css
/* 品牌色 */
--brand-dark: #212322;
--brand-green: #4A6A6A1D;
--brand-yellow: #e0e721;

/* 渐变 */
--grad-yellow-btn / --grad-yellow-hover
--grad-green
--grad-back-btn / --grad-back-hover（返回按钮，比 disabled 更深）
--grad-gray-btn / --grad-gray-hover（仅用于 btn-next:disabled）
```

---

## 开发规范

详见 `harness.md`，核心要点：
- 所有修改先进入 Plan 模式沟通
- 分步执行，每步等确认
- 改动超 3 个文件需分批
- 每次版本变更同步更新 CHANGELOG.md
- Git tag 标记版本，保留最近 10 个

### 代码质量守则（防止屎山）

1. **禁止重复代码** — 提取常量、复用函数，不复制粘贴
2. **禁止硬编码** — 颜色用 CSS 变量，配置用常量对象
3. **禁止全局污染** — 用 `const/let`，不用 `var`
4. **DOM 操作要缓存** — 用 `els` 对象，不重复 `getElementById`
5. **事件委托优先** — 用 `.content` 统一监听，不逐个绑定
6. **状态单向流动** — 用户操作 → 更新 state → 渲染 UI
7. **修改前先搜索** — 确认函数/变量没有其他引用

### 测试检查点

修改后必须验证：
- [ ] 犬/猫完整流程能走完（所有步骤正常切换）
- [ ] 结果页 MER 数值正确（RER × 系数）
- [ ] 喂食量表显示正确（5 个产品、包数计算正确）
- [ ] 返回/重新计算功能正常
- [ ] 手机预览正常（样式响应式）

---

## 开发环境

- **本地服务器**：`http-server -p 8080 -c-1`（Node.js，禁用缓存）
- **本机 IP**：可能变化，用 `ipconfig | grep "IPv4"` 查询
- **手机预览**：`http://<本机IP>:8080`（手机与电脑需同 WiFi）

### Git Remotes（均为 SSH）

| Remote | 地址 |
|--------|------|
| `origin` | `git@github.com:callmeyuj/test-pet-calories-calculator.git` |
| `pet-calories` | `git@github.com:callmeyuj/pet-calories-calculator.git` |

同时推送两个 remote：
```bash
git push origin main && git push pet-calories main
```

---

## 当前版本

**V2.1** — 2026/06/28（喂食量页按钮调整 + harness 规范更新）

---

## 待办功能（2026/06/27 提出）

### 1. optcard 点击音效
- 范围：option-btn（步骤选项卡片）点击时播放音效
- 方案：用 Web Audio API 生成短促点击音（或用户后续提供音效文件）
- 状态：**待实现**

### 2. 分享快照功能
- 在结果页（Step 9）生成当前结果的图片，供用户保存/分享
- 可能需要引入 html2canvas 库
- 状态：**待实现**

---

## 最近修改记录

| 时间 | 内容 |
|------|------|
| 2026/06/28 | V2.1 喂食量页按钮调整（左：重新计算，右：前往商城）+ harness 规范更新 |
| 2026/06/28 | V2.0 代码结构大重构（动态步骤生成、规则工厂、CSS 变量系统、无障碍适配） |
| 2026/06/28 | 查看喂食量按钮添加微光 + 光晕呼吸 + 萤火虫特效 |
| 2026/06/27 | btn-back 背景改深（不再和 disabled 一样灰），箭头统一用 `back-hover-arrow.png` |
| 2026/06/27 | pet-calories remote 从 HTTPS 改为 SSH（解决网络切换后连接失败） |
| 2026/06/27 | V1.4 代码重构（常量提取、CSS 变量化、DOM 缓存、死代码清理） |
| 2026/06/27 | V1.34 推导明细精简、性别 emoji 更换、展开/收起滚动优化 |
| 2026/06/27 | V1.3 入场动画、按压反馈、推导过程展开动画优化 |
