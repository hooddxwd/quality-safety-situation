# 专项分析大屏模块（5 子页） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建「专项分析」大屏模块，含 5 个 16:9 子页（专项分析/工作计划/总体态势/案例分析/规律总结），从首页态势「专题分析」入口跳转进入，顶部导航与首页态势一致，数据先写死前端（Phase1 mock）。

**Architecture:** Vue2 + ant-design-vue 1.7 + ECharts 5.6 + Less。嵌套路由 `/special-analysis/:tab`；`Layout.vue` 持有 1920×1080 等比缩放 stage + 复用 `SituationHeader` + 新增 `SubTabs` + `<router-view>`；每个子页 = 该页 bg 打底 + 绝对定位 overlay，overlay 盖在 bg 烘焙内容上。图表/表格组件全部参数化、5 页共用。

**Tech Stack:** Vue 2.6, vue-router 3, ant-design-vue 1.7, echarts 5.6, Less, vue-cli-service。

---

## ⚠️ 验证策略（TDD 适配说明）

本仓库**无测试框架**（`package.json` 只有 `serve`/`build`/`build:test`/`lint`，无 jest/vitest，无测试文件）。且本任务是可视化大屏（ECharts + 像素叠层），单测价值低。故采用以下验证替代 TDD 红绿：

- **自动门禁**：每个任务结束跑 `npm run lint`（ESLint 语法/风格检查）—— 必须无 error。
- **可视验证**：`npm run serve` 起开发服务器，浏览器进入对应路由，肉眼确认页面渲染、图表显示、导航切换正常。
- **频繁提交**：每个任务一个 commit，便于回滚。

代码风格对齐现有 situation 页：无分号、单引号、2 空格缩进、括号内空格。

---

## File Structure（职责划分）

```
ant-design-vue-jeecg/src/views/specialAnalysis/
├── Layout.vue                 # 缩放 stage + SituationHeader + SubTabs + router-view（唯一用 useScale 的文件）
├── useScale.js                # 16:9 单屏缩放 mixin
├── SubTabs.vue                # 5 子 tab 切换行
├── specialAnalysis.less       # 全局类（.sa-screen/.sa-stage/.sa-page/.sa-slot/.num-tech）
├── assets/
│   ├── bg-overall.png         # bg-special/workplan/case/pattern 同理（5 张）
│   └── tabs/{专项分析,工作计划,总体态势,案例分析,规律总结}.png
├── theme/{variables.less, echarts-theme.json}   # 复制自 situation
├── components/                # 通用展示/图表组件，参数化复用
│   ├── BaseChart.vue          # 复制自 situation（ECharts 封装）
│   ├── KpiNumber.vue          # 大数字（多值/百分比/单值）
│   ├── DonutChart.vue         # 环形图
│   ├── BarChart.vue           # 柱图（可选阈值线）
│   ├── StackedBarChart.vue    # 堆叠柱 / 横向甘特
│   ├── TrendChart.vue         # 分组柱+折线双轴
│   ├── GaugeBar.vue           # 进度条
│   ├── HeatmapChart.vue       # 热力图
│   ├── DataTable.vue          # a-table 科技风主题
│   └── NumberedList.vue       # 编号文本列表
├── pages/{Overall,Special,WorkPlan,CaseAnalysis,PatternSummary}.vue
├── mock/{overall,special,workplan,caseAnalysis,patternSummary}.js
└── api/specialApi.js          # Phase1 Promise.resolve(mock)
```

**修改的现有文件：**
- `src/config/router.config.js`（新增路由族）
- `src/views/situation/index.vue`（`onNav` 加 `专题分析` 跳转）

---

## Phase 0 — Foundation（脚手架 + 可导航壳）

### Task 1: 建目录 + 拷贝素材 + 拷贝 theme/BaseChart

**Files:**
- Create: `ant-design-vue-jeecg/src/views/specialAnalysis/` (空目录骨架)
- Copy: 5 张 bg + 5 张 tab 图 + theme 两文件 + BaseChart

- [ ] **Step 1: 拷贝背景图（5 张，重命名为统一前缀）**

Run:
```bash
cd "ant-design-vue-jeecg/src/views/specialAnalysis"
mkdir -p assets/tabs theme components pages mock api
cp "../../../../切图/专项分析切图/总体态势/专项分析-总体态势bj.png" assets/bg-overall.png
cp "../../../../切图/专项分析切图/专项分析/专项分析-专项分析bj.png" assets/bg-special.png
cp "../../../../切图/专项分析切图/工作计划/专项分析-工作计划bj.png" assets/bg-workplan.png
cp "../../../../切图/专项分析切图/案例分析/专项分析-案例分析bj.png" assets/bg-case.png
cp "../../../../切图/专项分析切图/规律总结/专项分析-规律总结bj.png" assets/bg-pattern.png
```

- [ ] **Step 2: 拷贝子 tab 切图**

Run:
```bash
cd "ant-design-vue-jeecg/src/views/specialAnalysis/assets/tabs"
cp "../../../../../切图/专项分析切图/工作计划/专项分析.png" .
cp "../../../../../切图/专项分析切图/工作计划/工作计划.png" .
cp "../../../../../切图/专项分析切图/工作计划/总体态势.png" .
cp "../../../../../切图/专项分析切图/工作计划/案例分析.png" .
cp "../../../../../切图/专项分析切图/工作计划/规律总结.png" .
```

- [ ] **Step 3: 拷贝 theme 与 BaseChart（自包含）**

Run:
```bash
cd "ant-design-vue-jeecg/src/views/specialAnalysis"
cp ../situation/theme/variables.less theme/
cp ../situation/theme/echarts-theme.json theme/
cp ../situation/components/BaseChart.vue components/BaseChart.vue
```
> BaseChart 内 `import theme from '../theme/echarts-theme.json'` 路径在新位置仍正确（components/ → ../theme/）。

- [ ] **Step 4: 验证文件就位**

Run: `ls -R ant-design-vue-jeecg/src/views/specialAnalysis | head -40`
Expected: 看到 assets/(bg-*.png + tabs/)、theme/、components/BaseChart.vue、空的 pages/mock/api。

- [ ] **Step 5: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis
git commit -m "feat(special-analysis): 脚手架与素材就位"
```

---

### Task 2: useScale.js（16:9 单屏缩放）

**Files:** Create `ant-design-vue-jeecg/src/views/specialAnalysis/useScale.js`

- [ ] **Step 1: 写 useScale.js**

```js
// 16:9 单屏：min(宽比,高比) 缩放并居中，非 16:9 留黑边，无滚动
const DESIGN_W = 1920
const DESIGN_H = 1080

export default {
  data () {
    return { scaleStyle: {}, screenStyle: {} }
  },
  mounted () {
    this.computeScale()
    window.addEventListener('resize', this.computeScale)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.computeScale)
  },
  methods: {
    computeScale () {
      const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
      this.scaleStyle = {
        width: DESIGN_W + 'px',
        height: DESIGN_H + 'px',
        position: 'absolute',
        left: ((window.innerWidth - DESIGN_W * s) / 2) + 'px',
        top: ((window.innerHeight - DESIGN_H * s) / 2) + 'px',
        transformOrigin: '0 0',
        transform: `scale(${s})`
      }
      this.screenStyle = {
        position: 'fixed',
        top: '0', left: '0', right: '0', bottom: '0',
        overflow: 'hidden',
        background: '#061a33'
      }
    }
  }
}
```

- [ ] **Step 2: lint**

Run: `cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/useScale.js 2>&1 | tail -5`
Expected: 无 error（warning 可忽略）。

- [ ] **Step 3: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/useScale.js
git commit -m "feat(special-analysis): 16:9 单屏缩放 mixin"
```

---

### Task 3: specialAnalysis.less（全局类）

**Files:** Create `ant-design-vue-jeecg/src/views/specialAnalysis/specialAnalysis.less`

- [ ] **Step 1: 写 less**

```less
@import './theme/variables.less';

.sa-screen {
  position: relative;
  width: 100vw;
  font-family: @sit-font-cn;
  background: @sit-bg;
}

// 1920×1080 缩放舞台（由 useScale 注入 inline style 覆盖尺寸/位移）
.sa-stage {
  position: relative;
}

// 页面层：填满舞台，承载该页 bg + overlay
.sa-page {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

// overlay 槽位：绝对定位（left/top/width/height 用百分比，随舞台等比缩放）
// 半透明深底，盖住 bg 烘焙的示例内容，露出 bg 的边框/标题
.sa-slot {
  position: absolute;
  background: rgba(6, 26, 51, 0.92);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.num-tech { font-family: @sit-font-num; font-weight: 700; }
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/specialAnalysis.less
git commit -m "feat(special-analysis): 全局样式类"
```

---

### Task 4: SubTabs.vue（5 子 tab 切换行）

**Files:** Create `ant-design-vue-jeecg/src/views/specialAnalysis/SubTabs.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <div class="sa-subtabs">
    <div
      v-for="t in tabs"
      :key="t.key"
      class="sa-subtab"
      :class="{ active: t.key === active }"
      @click="$emit('change', t.key)"
    >{{ t.label }}</div>
  </div>
</template>

<script>
export default {
  name: 'SaSubTabs',
  props: {
    active: { type: String, required: true }
  },
  data () {
    return {
      tabs: [
        { key: 'special', label: '专项分析' },
        { key: 'workplan', label: '工作计划' },
        { key: 'overall', label: '总体态势' },
        { key: 'case', label: '案例分析' },
        { key: 'pattern', label: '规律总结' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import './theme/variables.less';

.sa-subtabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 40px;
}
.sa-subtab {
  color: @sit-text;
  font-size: 16px;
  letter-spacing: 1px;
  padding: 6px 26px;
  border-radius: 18px;
  border: 1px solid @sit-panel-border;
  background: rgba(24, 144, 255, 0.08);
  opacity: 0.6;
  cursor: pointer;
  transition: all .25s;
}
.sa-subtab:hover { opacity: 0.9; color: @sit-cyan; }
.sa-subtab.active {
  opacity: 1;
  color: @sit-cyan;
  font-weight: 700;
  border-color: @sit-cyan;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
}
</style>
```

> 子 tab 底图（`assets/tabs/*.png`）暂用纯样式胶囊；Task 29 polish 阶段可换成切图底图。先保可用。

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/SubTabs.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/SubTabs.vue
git commit -m "feat(special-analysis): 子 tab 切换行"
```

---

### Task 5: 5 个 page 桩 + mock 桩 + specialApi.js

**Files:**
- Create: `pages/{Overall,Special,WorkPlan,CaseAnalysis,PatternSummary}.vue`（桩）
- Create: `mock/{overall,special,workplan,caseAnalysis,patternSummary}.js`（桩）
- Create: `api/specialApi.js`

- [ ] **Step 1: 写 5 个 mock 桩（每个导出空结构，后续 phase 填）**

`mock/overall.js`:
```js
export default { kpi: [], charts: {} }
```
`mock/special.js` / `mock/workplan.js` / `mock/caseAnalysis.js` / `mock/patternSummary.js`: 同样 `export default { placeholder: true }`。

- [ ] **Step 2: 写 api 层**

`api/specialApi.js`:
```js
// Phase1：返回 mock；Phase2 后端就绪时，把每个函数体改为 axios 请求，组件不改。
import overallMock from '../mock/overall'
import specialMock from '../mock/special'
import workplanMock from '../mock/workplan'
import caseMock from '../mock/caseAnalysis'
import patternMock from '../mock/patternSummary'

// GET /special-analysis/overall
export function getOverallData () { return Promise.resolve(overallMock) }
// GET /special-analysis/special
export function getSpecialData () { return Promise.resolve(specialMock) }
// GET /special-analysis/workplan
export function getWorkPlanData () { return Promise.resolve(workplanMock) }
// GET /special-analysis/case
export function getCaseData () { return Promise.resolve(caseMock) }
// GET /special-analysis/pattern
export function getPatternData () { return Promise.resolve(patternMock) }
```

- [ ] **Step 3: 写 5 个 page 桩（显示 bg + 标题，验证导航）**

`pages/Overall.vue`:
```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="sa-page__stub">总体态势（建设中）</div>
  </div>
</template>

<script>
import bg from '../assets/bg-overall.png'
export default {
  name: 'SaOverall',
  data () { return { bg } }
}
</script>

<style lang="less" scoped>
.sa-page__stub {
  position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%);
  color: #fff; font-size: 40px; opacity: 0.6;
}
</style>
```

`pages/Special.vue`（bg 改 `bg-special.png`，文案「专项分析」）、`WorkPlan.vue`（`bg-workplan.png`/「工作计划」）、`CaseAnalysis.vue`（`bg-case.png`/「案例分析」）、`PatternSummary.vue`（`bg-pattern.png`/「规律总结」）—— 结构与 Overall.vue 完全相同，仅改 import 的 bg 与文案。

- [ ] **Step 4: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis
git commit -m "feat(special-analysis): page 桩 + mock 桩 + api 层"
```

---

### Task 6: Layout.vue（缩放舞台 + Header + SubTabs + router-view）

**Files:** Create `ant-design-vue-jeecg/src/views/specialAnalysis/Layout.vue`

- [ ] **Step 1: 写 Layout.vue**

```vue
<template>
  <div class="sa-screen" :style="screenStyle">
    <div class="sa-stage" :style="scaleStyle">
      <!-- 页面层：bg + overlay（router-view） -->
      <router-view />

      <!-- 代码 header 层（盖在 bg 烘焙标题上） -->
      <situation-header
        class="sa-layout-header"
        :data="header"
        active-tab="专题分析"
        @nav="onHeaderNav"
        @alert="onAlert"
      />
      <sa-sub-tabs
        class="sa-layout-subtabs"
        :active="tab"
        @change="onSubTab"
      />
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import SituationHeader from '../situation/components/SituationHeader.vue'
import headerMock from '../situation/mock/header.js'
import SaSubTabs from './SubTabs.vue'
import useScale from './useScale'

export default {
  name: 'SaLayout',
  components: { SituationHeader, SaSubTabs },
  mixins: [useScale],
  data () {
    return { header: headerMock }
  },
  computed: {
    tab () { return (this.$route.meta && this.$route.meta.tab) || 'overall' }
  },
  methods: {
    onHeaderNav (t) {
      if (t === '总体态势') return this.$router.push('/situation')
      if (t === '专题分析') return
      message.info(`「${t}」建设中`)
    },
    onAlert () { message.warning('专项分析预警（Phase1 交互壳）') },
    onSubTab (key) {
      if (key !== this.tab) this.$router.push('/special-analysis/' + key)
    }
  }
}
</script>

<style lang="less">
@import './specialAnalysis.less';

.sa-layout-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 20;
}
.sa-layout-subtabs {
  position: absolute;
  top: 125px; left: 0; right: 0;
  z-index: 20;
  background: linear-gradient(180deg, rgba(6,26,51,0.85), rgba(6,26,51,0));
}
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/Layout.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/Layout.vue
git commit -m "feat(special-analysis): Layout 缩放舞台 + 顶导 + 子tab"
```

---

### Task 7: 注册路由 + 接通 situation 跳转

**Files:**
- Modify: `ant-design-vue-jeecg/src/config/router.config.js`（在 `/situation` 后插入）
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（`onNav`）

- [ ] **Step 1: 路由族插入 constantRouterMap**

在 `router.config.js` 的 `/situation` 条目之后（约 302 行后）插入：

```js
  {
    path: '/special-analysis',
    component: () => import('@/views/specialAnalysis/Layout'),
    redirect: '/special-analysis/overall',
    children: [
      { path: 'overall', name: 'sa-overall', component: () => import('@/views/specialAnalysis/pages/Overall'), meta: { title: '专项分析·总体态势', tab: 'overall' } },
      { path: 'special', name: 'sa-special', component: () => import('@/views/specialAnalysis/pages/Special'), meta: { title: '专项分析·专项分析', tab: 'special' } },
      { path: 'workplan', name: 'sa-workplan', component: () => import('@/views/specialAnalysis/pages/WorkPlan'), meta: { title: '专项分析·工作计划', tab: 'workplan' } },
      { path: 'case', name: 'sa-case', component: () => import('@/views/specialAnalysis/pages/CaseAnalysis'), meta: { title: '专项分析·案例分析', tab: 'case' } },
      { path: 'pattern', name: 'sa-pattern', component: () => import('@/views/specialAnalysis/pages/PatternSummary'), meta: { title: '专项分析·规律总结', tab: 'pattern' } }
    ]
  },
```

- [ ] **Step 2: situation/index.vue 的 onNav 加跳转**

把 `onNav` 改为：

```js
    onNav (t) {
      this.activeTab = t
      if (t === '专题分析') return this.$router.push('/special-analysis')
      if (t !== '总体态势') message.info(`「${t}」建设中`)
    },
```

- [ ] **Step 3: lint**

Run: `cd ant-design-vue-jeecg && npm run lint -- --no-fix src/config/router.config.js src/views/situation/index.vue 2>&1 | tail -3`
Expected: 无 error。

- [ ] **Step 4: 可视验证（Phase 0 完成标志）**

Run: `cd ant-design-vue-jeecg && npm run serve`
浏览器：
1. 进 `/situation`，点顶部「专题分析」→ 跳到 `/special-analysis/overall`
2. 看到 SituationHeader（「专题分析」高亮）+ 下方 5 子 tab + 总体态势 bg
3. 点 5 个子 tab → URL 切换、bg 跟着变
4. 点 header「总体态势」→ 回 `/situation`

Expected: 上述全部正常。若有编译错，按报错修。

- [ ] **Step 5: Commit**

```bash
git add ant-design-vue-jeecg/src/config/router.config.js ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(special-analysis): 注册路由 + 接通首页态势跳转"
```

---

## Phase 1 — 共享图表/展示组件（5 页共用）

> 这些组件都被 `<BaseChart>`（已拷贝）封装。BaseChart 接收 `option` prop，内部用 `echarts.init(el,'situation')` 渲染。所以每个图表组件 = 收 data prop → 组装 option → 传给 BaseChart。
> 通用约定：所有图表 `backgroundColor: 'transparent'`（overlay 槽位已提供深底）。

### Task 8: KpiNumber.vue（大数字，3 形态）

**Files:** Create `components/KpiNumber.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <div class="kpi-number">
    <div class="kpi-number__label">{{ item.label }}</div>
    <!-- 多值（如 6·42·238） -->
    <div v-if="item.values" class="kpi-number__multi">
      <div v-for="(v, i) in item.values" :key="i" class="kpi-multi-item">
        <span class="kpi-mini-label">{{ v.label }}</span>
        <span class="num-tech kpi-mini-val" :class="'tone-' + v.tone">{{ v.value }}</span>
      </div>
    </div>
    <!-- 单值 -->
    <div v-else class="kpi-number__value num-tech" :class="'tone-' + (item.tone || 'blue')">
      {{ item.value }}<span class="kpi-number__unit">{{ item.unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaKpiNumber',
  props: { item: { type: Object, required: true } }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.kpi-number { display:flex; flex-direction:column; justify-content:center; height:100%; padding:0 16px; }
.kpi-number__label { color:@sit-text; font-size:18px; opacity:.85; }
.kpi-number__value { font-size:46px; line-height:1.1; margin-top:8px; }
.kpi-number__unit { font-size:18px; margin-left:6px; opacity:.8; font-weight:400; }
.kpi-number__multi { display:flex; gap:18px; margin-top:10px; }
.kpi-multi-item { display:flex; flex-direction:column; }
.kpi-mini-label { font-size:13px; opacity:.75; }
.kpi-mini-val { font-size:30px; line-height:1.1; }
.tone-blue { color:@sit-blue; text-shadow:0 0 8px rgba(24,144,255,.5); }
.tone-yellow { color:@sit-yellow; text-shadow:0 0 8px rgba(255,193,7,.5); }
.tone-red { color:@sit-red; text-shadow:0 0 8px rgba(255,77,79,.5); }
.tone-green { color:@sit-green; text-shadow:0 0 8px rgba(0,196,140,.5); }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/KpiNumber.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/KpiNumber.vue
git commit -m "feat(special-analysis): KpiNumber 组件"
```

---

### Task 9: DonutChart.vue

**Files:** Create `components/DonutChart.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaDonutChart',
  components: { BaseChart },
  props: {
    data: { type: Array, required: true } // [{ name, value }]
  },
  computed: {
    option () {
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: {
          type: 'scroll', orient: 'vertical', right: '3%', top: 'center',
          textStyle: { color: '#fff', fontSize: 13 },
          pageTextStyle: { color: '#fff' }
        },
        series: [{
          name: '占比', type: 'pie',
          radius: ['42%', '68%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderColor: '#061a33', borderWidth: 2 },
          label: { show: true, formatter: '{d}%', color: '#fff', fontSize: 12 },
          labelLine: { length: 8, length2: 8 },
          data: this.data
        }]
      }
    }
  }
}
</script>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/DonutChart.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/DonutChart.vue
git commit -m "feat(special-analysis): DonutChart 组件"
```

---

### Task 10: BarChart.vue（可选阈值线）

**Files:** Create `components/BarChart.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaBarChart',
  components: { BaseChart },
  props: {
    categories: { type: Array, required: true }, // x 轴类目
    values: { type: Array, required: true },     // 数值
    threshold: { type: Number, default: null }   // 阈值线（如归零周期超期）
  },
  computed: {
    option () {
      const series = {
        type: 'bar',
        data: this.values,
        barMaxWidth: 28,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#00e5ff' }, { offset: 1, color: '#1890ff' }] }
        }
      }
      if (this.threshold != null) {
        series.markLine = {
          symbol: 'none',
          data: [{ yAxis: this.threshold, name: '超期' }],
          lineStyle: { color: '#ff4d4f', type: 'dashed' },
          label: { formatter: '超期', color: '#ff4d4f' }
        }
      }
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '8%', right: '6%', top: '15%', bottom: '12%' },
        xAxis: { type: 'category', data: this.categories,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        yAxis: { type: 'value',
          axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
        series: [series]
      }
    }
  }
}
</script>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/BarChart.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/BarChart.vue
git commit -m "feat(special-analysis): BarChart 组件（含阈值线）"
```

---

### Task 11: StackedBarChart.vue（竖向堆叠 / 横向甘特）

**Files:** Create `components/StackedBarChart.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaStackedBarChart',
  components: { BaseChart },
  props: {
    // 竖向堆叠：categories=x 类目，series=[{name,data}]，每条 stack:'total'
    categories: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
    // 横向甘特模式：gantt=true 时用 ganttRows=[{name, segments:[{start,end,color}]}], monthCount
    gantt: { type: Boolean, default: false },
    ganttRows: { type: Array, default: () => [] },
    monthCount: { type: Number, default: 11 }
  },
  computed: {
    option () {
      return this.gantt ? this.ganttOption : this.stackedOption
    },
    stackedOption () {
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { textStyle: { color: '#fff' }, top: 0 },
        grid: { left: '8%', right: '6%', top: '18%', bottom: '12%' },
        xAxis: { type: 'category', data: this.categories,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        yAxis: { type: 'value',
          axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
        series: this.series.map(s => ({ ...s, type: 'bar', stack: 'total', barMaxWidth: 30 }))
      }
    },
    ganttOption () {
      const rowNames = this.ganttRows.map(r => r.name)
      // 透明 base + 彩色段：每行先放一个透明 bar 占位 [0,start]，再放可见段
      const palette = ['#1890ff', '#00c48c', '#ffc107', '#ff4d4f', '#a070ff']
      const bases = { name: 'base', type: 'bar', stack: 'gantt', itemStyle: { color: 'transparent' }, data: [] }
      const segSeries = []
      this.ganttRows.forEach((row, ri) => {
        let cursor = 0
        row.segments.forEach((seg, si) => {
          // base 占位补到 seg.start
          const baseSeriesIdx = si
          if (!segSeries[si]) {
            segSeries[si] = { name: 'seg' + si, type: 'bar', stack: 'gantt', itemStyle: { color: palette[ri % palette.length] }, data: [] }
          }
        })
      })
      // 简化：每行单段实现（start~end），用 base 占位
      const baseData = this.ganttRows.map(r => r.segments[0] ? r.segments[0].start : 0)
      const segData = this.ganttRows.map(r => {
        const s = r.segments[0] || { start: 0, end: 0 }
        return s.end - s.start
      })
      const colors = this.ganttRows.map((r, i) => r.color || palette[i % palette.length])
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { show: false },
        grid: { left: '14%', right: '6%', top: '8%', bottom: '12%' },
        xAxis: { type: 'value', max: this.monthCount,
          axisLabel: { color: '#fff', formatter: v => 'M' + v }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
        yAxis: { type: 'category', data: rowNames, inverse: true,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        series: [
          { name: 'base', type: 'bar', stack: 'gantt', itemStyle: { color: 'transparent' }, data: baseData },
          { name: 'dur', type: 'bar', stack: 'gantt',
            data: segData.map((v, i) => ({ value: v, itemStyle: { color: colors[i] } })),
            label: { show: true, formatter: '治理中', color: '#fff', fontSize: 11 } }
        ]
      }
    }
  }
}
</script>
```

> 说明：甘特图用「透明 base 占位 + 可见段」经典 ECharts 技法。当前实现支持每行一段；若设计图某治理项有多段，在 Task 29 polish 时扩展为多 series。

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/StackedBarChart.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/StackedBarChart.vue
git commit -m "feat(special-analysis): StackedBarChart 组件（堆叠/甘特）"
```

---

### Task 12: TrendChart.vue（分组柱 + 折线双轴）

**Files:** Create `components/TrendChart.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaTrendChart',
  components: { BaseChart },
  props: {
    categories: { type: Array, required: true },     // x（如机型/月份）
    bars: { type: Array, required: true },            // [{name,data,color}]
    line: { type: Object, default: null }             // {name,data,color}
  },
  computed: {
    option () {
      const series = this.bars.map(b => ({
        name: b.name, type: 'bar', data: b.data, stack: 'trend', barMaxWidth: 24,
        itemStyle: { color: b.color || '#1890ff' }
      }))
      if (this.line) {
        series.push({
          name: this.line.name, type: 'line', data: this.line.data, yAxisIndex: 1,
          smooth: true, symbolSize: 8,
          lineStyle: { color: this.line.color || '#ffc107', width: 3 },
          itemStyle: { color: this.line.color || '#ffc107' }
        })
      }
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { textStyle: { color: '#fff' }, top: 0 },
        grid: { left: '8%', right: '9%', top: '18%', bottom: '12%' },
        xAxis: { type: 'category', data: this.categories,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        yAxis: [
          { type: 'value', name: '数量', nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
          { type: 'value', name: '万时率', nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' }, splitLine: { show: false } }
        ],
        series
      }
    }
  }
}
</script>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/TrendChart.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/TrendChart.vue
git commit -m "feat(special-analysis): TrendChart 组件（柱+线双轴）"
```

---

### Task 13: GaugeBar.vue（进度条）

**Files:** Create `components/GaugeBar.vue`

- [ ] **Step 1: 写组件（纯样式，非 ECharts）**

```vue
<template>
  <div class="gauge-bar">
    <div class="gauge-bar__label">{{ item.label }}</div>
    <div class="gauge-bar__track">
      <div class="gauge-bar__fill" :style="{ width: item.value + '%' }"></div>
    </div>
    <div class="gauge-bar__value num-tech">{{ item.value }}%</div>
  </div>
</template>

<script>
export default {
  name: 'SaGaugeBar',
  props: { item: { type: Object, required: true } } // { label, value }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.gauge-bar { display:flex; flex-direction:column; justify-content:center; height:100%; padding:0 18px; gap:10px; }
.gauge-bar__label { color:@sit-text; font-size:17px; }
.gauge-bar__track { height:14px; border-radius:7px; background:rgba(255,255,255,.12); overflow:hidden; }
.gauge-bar__fill { height:100%; border-radius:7px;
  background:linear-gradient(90deg,@sit-cyan,@sit-green); box-shadow:0 0 10px rgba(0,229,255,.6); transition:width .6s; }
.gauge-bar__value { font-size:34px; color:@sit-cyan; text-shadow:0 0 8px rgba(0,229,255,.5); }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/GaugeBar.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/GaugeBar.vue
git commit -m "feat(special-analysis): GaugeBar 进度条组件"
```

---

### Task 14: HeatmapChart.vue

**Files:** Create `components/HeatmapChart.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaHeatmapChart',
  components: { BaseChart },
  props: {
    xLabels: { type: Array, required: true },   // 列（阶段）
    yLabels: { type: Array, required: true },   // 行（问题词）
    points: { type: Array, required: true },    // [[x,y,val]...]
    max: { type: Number, default: 20 }
  },
  computed: {
    option () {
      return {
        backgroundColor: 'transparent',
        tooltip: { position: 'top', formatter: p => `${this.yLabels[p.value[1]]} × ${this.xLabels[p.value[0]]}: ${p.value[2]}` },
        grid: { left: '15%', right: '6%', top: '8%', bottom: '15%' },
        xAxis: { type: 'category', data: this.xLabels, splitArea: { show: true },
          axisLabel: { color: '#fff', fontSize: 11 } },
        yAxis: { type: 'category', data: this.yLabels, splitArea: { show: true },
          axisLabel: { color: '#fff', fontSize: 11 } },
        visualMap: { min: 0, max: this.max, calculable: true, orient: 'horizontal',
          left: 'center', bottom: '2%',
          inRange: { color: ['#0a2a5a', '#1890ff', '#00e5ff', '#ffc107'] },
          textStyle: { color: '#fff' } },
        series: [{
          type: 'heatmap', data: this.points,
          label: { show: false },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
        }]
      }
    }
  }
}
</script>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/HeatmapChart.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/HeatmapChart.vue
git commit -m "feat(special-analysis): HeatmapChart 组件"
```

---

### Task 15: DataTable.vue（a-table 科技风）

**Files:** Create `components/DataTable.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <a-table
    class="sa-table"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
    size="small"
    :scroll="{ y: tableHeight }"
    row-key="key"
  >
    <template v-for="c in levelColumns" :slot="c.dataIndex" slot-scope="text">
      <span :key="c.dataIndex" class="sa-level" :class="'sa-level--' + levelClass(text)">{{ text }}</span>
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'SaDataTable',
  props: {
    columns: { type: Array, required: true }, // [{title,dataIndex,key?,level?}]
    rows: { type: Array, required: true },
    tableHeight: { type: [Number, String], default: 220 }
  },
  computed: {
    levelColumns () { return this.columns.filter(c => c.level) }
  },
  methods: {
    levelClass (v) {
      if (/重大|督办/.test(v)) return 'red'
      if (/严重|验证|整改/.test(v)) return 'yellow'
      return 'blue'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
/deep/ .sa-table {
  background: transparent;
  .ant-table-thead > tr > th {
    background: rgba(24,144,255,.18);
    color: @sit-text;
    border-bottom: 1px solid @sit-panel-border;
    font-size: 13px;
  }
  .ant-table-tbody > tr > td {
    background: transparent;
    color: @sit-text;
    border-bottom: 1px solid rgba(24,144,255,.12);
    font-size: 13px;
  }
  .ant-table-tbody > tr:hover > td { background: rgba(24,144,255,.08); }
  .ant-table-placeholder { background: transparent; color: @sit-text; }
}
.sa-level {
  display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px;
  border: 1px solid;
}
.sa-level--red { color: @sit-red; border-color: @sit-red; background: rgba(255,77,79,.12); }
.sa-level--yellow { color: @sit-yellow; border-color: @sit-yellow; background: rgba(255,193,7,.12); }
.sa-level--blue { color: @sit-blue; border-color: @sit-blue; background: rgba(24,144,255,.12); }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/DataTable.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/DataTable.vue
git commit -m "feat(special-analysis): DataTable 科技风表格组件"
```

---

### Task 16: NumberedList.vue（编号文本列表）

**Files:** Create `components/NumberedList.vue`

- [ ] **Step 1: 写组件**

```vue
<template>
  <div class="numbered-list">
    <div v-for="(it, i) in items" :key="i" class="nl-item">
      <span class="nl-idx">{{ i + 1 }}</span>
      <div class="nl-body">
        <div class="nl-title">{{ it.title }}</div>
        <div class="nl-desc">{{ it.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaNumberedList',
  props: { items: { type: Array, required: true } } // [{title,desc}]
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.numbered-list { display:flex; flex-direction:column; gap:14px; padding:14px 16px; overflow:auto; height:100%; }
.nl-item { display:flex; gap:12px; }
.nl-idx {
  flex:0 0 26px; height:26px; border-radius:50%;
  background:linear-gradient(135deg,@sit-cyan,@sit-blue); color:#fff;
  display:flex; align-items:center; justify-content:center; font-weight:700;
  box-shadow:0 0 8px rgba(0,229,255,.5);
}
.nl-title { color:@sit-text; font-size:16px; font-weight:600; }
.nl-desc { color:@sit-text; opacity:.75; font-size:13px; margin-top:4px; line-height:1.5; }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/components/NumberedList.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/components/NumberedList.vue
git commit -m "feat(special-analysis): NumberedList 组件"
```

---

## Phase 2 — 总体态势 (Overall) 页

### Task 17: overall mock（完整数据）

**Files:** Modify `mock/overall.js`

- [ ] **Step 1: 写 mock（数值对齐设计图）**

```js
export default {
  kpi: [
    { label: '质量问题总数', value: 286, unit: '', tone: 'blue' },
    { label: '自用产品问题数', value: 126, unit: '', tone: 'blue' },
    { label: '出口产品问题数', value: 82, unit: '', tone: 'blue' },
    { label: '民用产品问题数', value: 78, unit: '', tone: 'blue' },
    { label: '分级问题统计', values: [
      { label: '重大', value: 6, tone: 'red' },
      { label: '严重', value: 42, tone: 'yellow' },
      { label: '一般', value: 238, tone: 'blue' }
    ] },
    { label: '问题闭环率', value: 91.6, unit: '%', tone: 'green' }
  ],
  userDist: [
    { name: '部队用户', value: 120 },
    { name: '出口用户', value: 45 },
    { name: '民航用户', value: 38 },
    { name: '试验用户', value: 30 },
    { name: '维修保障单位', value: 53 }
  ],
  trend: {
    categories: ['A-31', 'A-29', 'B-17', 'C-18', 'D-12', '保障装备'],
    bars: [
      { name: '重大', data: [2, 1, 1, 1, 1, 0], color: '#ff4d4f' },
      { name: '严重', data: [12, 9, 7, 8, 4, 2], color: '#ffc107' }
    ],
    line: { name: '万时率', data: [0.8, 0.7, 1.1, 0.9, 0.6, 0.5], color: '#00e5ff' }
  },
  reasonCat: [
    { name: '设计原因', value: 58 }, { name: '制造原因', value: 46 },
    { name: '装配原因', value: 39 }, { name: '器材原因', value: 34 },
    { name: '使用维护原因', value: 48 }, { name: '管理原因', value: 31 },
    { name: '待查原因', value: 30 }
  ],
  modelDist: [
    { name: 'A-31', value: 40 }, { name: 'A-29', value: 28 },
    { name: 'B-17', value: 22 }, { name: 'C-18', value: 18 },
    { name: 'D-12', value: 12 }, { name: '保障装备', value: 6 }
  ],
  unitDist: {
    categories: ['设计院', '总装厂', '附件厂', '试验站', '供应商'],
    series: [
      { name: '重大', data: [1, 2, 1, 1, 1] },
      { name: '严重', data: [8, 10, 7, 9, 8] },
      { name: '一般', data: [40, 52, 45, 48, 53] }
    ]
  },
  systemShare: [
    { name: '飞控系统', value: 38 }, { name: '动力系统', value: 30 },
    { name: '航电系统', value: 26 }, { name: '液压系统', value: 22 },
    { name: '结构系统', value: 18 }, { name: '保障设备', value: 14 }
  ],
  conclusion: {
    evaluation: '上半年三大品类问题总量处于受控区间，闭环率保持 90% 以上，质量安全总体平稳。',
    features: '自用产品问题占比最高，设计/制造环节为主因；A-31 型号与飞控系统为重点关注对象。',
    risks: '重大问题 6 项需重点督办，部分出口产品问题归零周期偏长，存在超期风险。'
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/mock/overall.js
git commit -m "feat(special-analysis): 总体态势 mock 数据"
```

---

### Task 18: Overall.vue（替换桩）

**Files:** Modify `pages/Overall.vue`

- [ ] **Step 1: 写完整页面（bg + overlay 槽位）**

```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <!-- KPI 行：6 卡，top 14% 起 -->
    <div v-for="(c, i) in data.kpi" :key="'k' + i" class="sa-slot kpi-slot"
         :style="slotStyle(kpiPos(i))">
      <kpi-number :item="c" />
    </div>

    <!-- 中排：用户分布 / 同比趋势 / 原因大类 -->
    <div class="sa-slot" :style="slotStyle({ left: '2%', top: '30%', w: '23%', h: '27%' })"><donut-chart :data="data.userDist" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '27%', top: '30%', w: '46%', h: '27%' })"><trend-chart :categories="data.trend.categories" :bars="data.trend.bars" :line="data.trend.line" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '75%', top: '30%', w: '23%', h: '27%' })"><donut-chart :data="data.reasonCat" /></div>

    <!-- 下排：型号分布 / 主责单位 / 系统占比 / 结论 -->
    <div class="sa-slot" :style="slotStyle({ left: '2%', top: '60%', w: '23%', h: '36%' })"><donut-chart :data="data.modelDist" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '27%', top: '60%', w: '23%', h: '36%' })"><stacked-bar-chart :categories="data.unitDist.categories" :series="data.unitDist.series" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '52%', top: '60%', w: '23%', h: '36%' })"><donut-chart :data="data.systemShare" /></div>
    <div class="sa-slot sa-conclusion" :style="slotStyle({ left: '77%', top: '60%', w: '21%', h: '36%' })">
      <div class="concl-sec"><div class="concl-h">上半年质量总体评价</div><div class="concl-t">{{ data.conclusion.evaluation }}</div></div>
      <div class="concl-sec"><div class="concl-h">核心运行特征</div><div class="concl-t">{{ data.conclusion.features }}</div></div>
      <div class="concl-sec"><div class="concl-h">主要矛盾与风险点</div><div class="concl-t">{{ data.conclusion.risks }}</div></div>
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-overall.png'
import { getOverallData } from '../api/specialApi'
import KpiNumber from '../components/KpiNumber.vue'
import DonutChart from '../components/DonutChart.vue'
import TrendChart from '../components/TrendChart.vue'
import StackedBarChart from '../components/StackedBarChart.vue'

export default {
  name: 'SaOverall',
  components: { KpiNumber, DonutChart, TrendChart, StackedBarChart },
  data () {
    return {
      bg,
      data: { kpi: [], userDist: [], trend: {}, reasonCat: [], modelDist: [], unitDist: {}, systemShare: [], conclusion: {} }
    }
  },
  async mounted () { this.data = await getOverallData() },
  methods: {
    kpiPos (i) {
      // 6 卡均匀分布在 2%~98%，top 14%~24%
      const left = 2 + i * (96 / 6)
      return { left: left + '%', top: '14%', w: (96 / 6 - 1.2) + '%', h: '12%' }
    },
    slotStyle (p) {
      return {
        left: p.left, top: p.top, width: p.w, height: p.h
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.kpi-slot { padding: 4px; }
.sa-conclusion { padding: 14px; gap: 12px; background: rgba(6,26,51,.88); }
.concl-sec { margin-bottom: 10px; }
.concl-h { color:@sit-cyan; font-size:14px; font-weight:700; margin-bottom:4px; }
.concl-t { color:@sit-text; font-size:13px; line-height:1.6; opacity:.85; }
</style>
```

> **坐标均为初始估计**：Task 29 polish 阶段对照 bg 烘焙槽位逐个微调 left/top/width/height 百分比，使 overlay 恰好落在烘焙面板内、不压住烘焙标题。

- [ ] **Step 2: lint + 可视验证**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/pages/Overall.vue 2>&1 | tail -3
npm run serve   # 浏览器 /special-analysis/overall 看到 6 KPI + 4 环形 + 趋势 + 堆叠柱 + 结论
```

- [ ] **Step 3: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/pages/Overall.vue
git commit -m "feat(special-analysis): 总体态势页实现"
```

---

## Phase 3 — 工作计划 (WorkPlan) 页

### Task 19: workplan mock

**Files:** Modify `mock/workplan.js`

- [ ] **Step 1: 写 mock**

```js
export default {
  kpi: [
    { label: '自用问题总数', value: 126, tone: 'blue' },
    { label: '已归零数', value: 114, tone: 'green' },
    { label: '归零完成率', value: 90.5, unit: '%', tone: 'green' },
    { label: '超期归零数', value: 7, tone: 'red' }
  ],
  typeDist: {
    categories: ['设计', '工艺', '装配', '试验', '管理'],
    series: [
      { name: '重大', data: [2, 1, 1, 1, 1] },
      { name: '严重', data: [10, 12, 7, 8, 5] },
      { name: '一般', data: [18, 28, 23, 18, 9] }
    ]
  },
  stageDist: [
    { name: '研制阶段', value: 22 },
    { name: '生产阶段', value: 38 },
    { name: '交付阶段', value: 17 },
    { name: '使用维护阶段', value: 24 }
  ],
  systemRank: {
    categories: ['结构系统', '液压系统', '航电系统', '动力系统', '飞控系统'],
    values: [16, 19, 22, 25, 30]
  },
  cycle: {
    categories: ['设计', '工艺', '装配', '试验', '管理'],
    values: [24, 18, 15, 21, 13],
    threshold: 20
  },
  table: {
    columns: [
      { title: '问题编号', dataIndex: 'id' },
      { title: '机型', dataIndex: 'model' },
      { title: '问题描述', dataIndex: 'desc' },
      { title: '当前状态', dataIndex: 'status', level: true },
      { title: '剩余周期', dataIndex: 'remain' }
    ],
    rows: [
      { key: '1', id: 'ZY-2606-018', model: 'A-31', desc: '飞控通道告警', status: '督办', remain: '5天' },
      { key: '2', id: 'ZY-2606-017', model: 'B-17', desc: '液压批次一致性偏差', status: '验证中', remain: '9天' },
      { key: '3', id: 'ZY-2606-016', model: 'A-29', desc: '航电接口边界条件异常', status: '待评审', remain: '2天' },
      { key: '4', id: 'ZY-2606-015', model: 'C-08', desc: '固定工艺执行偏差', status: '整改中', remain: '7天' }
    ]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/mock/workplan.js
git commit -m "feat(special-analysis): 工作计划 mock 数据"
```

---

### Task 20: WorkPlan.vue（替换桩）

**Files:** Modify `pages/WorkPlan.vue`

- [ ] **Step 1: 写页面**

```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <!-- 4 KPI -->
    <div v-for="(c, i) in data.kpi" :key="'k'+i" class="sa-slot"
         :style="{ left: (2 + i*24) + '%', top: '14%', width: '22%', height: '12%' }">
      <kpi-number :item="c" />
    </div>
    <!-- 中排 4 图 -->
    <div class="sa-slot" :style="{ left:'2%', top:'30%', width:'23%', height:'27%' }">
      <stacked-bar-chart :categories="data.typeDist.categories" :series="data.typeDist.series" />
    </div>
    <div class="sa-slot" :style="{ left:'26%', top:'30%', width:'23%', height:'27%' }">
      <donut-chart :data="data.stageDist" />
    </div>
    <div class="sa-slot" :style="{ left:'50%', top:'30%', width:'23%', height:'27%' }">
      <bar-chart :categories="data.systemRank.categories" :values="data.systemRank.values" />
    </div>
    <div class="sa-slot" :style="{ left:'74%', top:'30%', width:'24%', height:'27%' }">
      <bar-chart :categories="data.cycle.categories" :values="data.cycle.values" :threshold="data.cycle.threshold" />
    </div>
    <!-- 未归零清单 -->
    <div class="sa-slot" :style="{ left:'2%', top:'60%', width:'96%', height:'36%' }">
      <data-table :columns="data.table.columns" :rows="data.table.rows" :table-height="300" />
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-workplan.png'
import { getWorkPlanData } from '../api/specialApi'
import KpiNumber from '../components/KpiNumber.vue'
import DonutChart from '../components/DonutChart.vue'
import BarChart from '../components/BarChart.vue'
import StackedBarChart from '../components/StackedBarChart.vue'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'SaWorkPlan',
  components: { KpiNumber, DonutChart, BarChart, StackedBarChart, DataTable },
  data () {
    return { bg, data: { kpi: [], typeDist: {}, stageDist: [], systemRank: {}, cycle: {}, table: { columns: [], rows: [] } } }
  },
  async mounted () { this.data = await getWorkPlanData() }
}
</script>
```

- [ ] **Step 2: lint + 可视验证 + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/pages/WorkPlan.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/pages/WorkPlan.vue
git commit -m "feat(special-analysis): 工作计划页实现"
```

---

## Phase 4 — 规律总结 (PatternSummary) 页

### Task 21: pattern mock

**Files:** Modify `mock/patternSummary.js`

- [ ] **Step 1: 写 mock**

```js
export default {
  heatmap: {
    xLabels: ['设计', '装配', '管理', '器材', '制造', '交付', '使用'],
    yLabels: ['装配偏差', '批次一致性', '试验覆盖', '设计裕度', '归零周期', '接口匹配', '重复故障'],
    points: [
      [0,0,8],[1,0,14],[2,0,5],[3,0,11],[4,0,6],[5,0,3],[6,0,9],
      [0,1,6],[1,1,17],[2,1,4],[3,1,7],[4,1,12],[5,1,5],[6,1,10],
      [0,2,9],[1,2,3],[2,2,8],[3,2,5],[4,2,4],[5,2,11],[6,2,13],
      [0,3,15],[1,3,4],[2,3,6],[3,3,18],[4,3,5],[5,3,7],[6,3,9],
      [0,4,7],[1,4,10],[2,4,12],[3,4,6],[4,4,8],[5,4,16],[6,4,5],
      [0,5,12],[1,5,5],[2,5,9],[3,5,14],[4,5,7],[5,5,6],[6,5,11],
      [0,6,5],[1,6,8],[2,6,11],[3,6,4],[4,6,9],[5,6,6],[6,6,20]
    ],
    max: 20
  },
  deepCause: [
    { name: '技术层', value: 38 }, { name: '工艺层', value: 28 },
    { name: '管理层', value: 18 }, { name: '供应链', value: 10 },
    { name: '标准规范', value: 6 }
  ],
  problems: [
    { title: '设计裕度不够', value: 31, pct: '10.8%', desc: '极限工况下性能边界偏窄，设计验证样本不足。' },
    { title: '接口匹配不充分', value: 27, pct: '9.4%', desc: '跨系统交联工况下接口兼容性验证覆盖不全。' },
    { title: '工艺一致性差', value: 46, pct: '16.1%', desc: '批次间工艺参数波动，关键工序一致性需提升。' },
    { title: '测试覆盖不足', value: 22, pct: '7.7%', desc: '边界与异常工况测试用例偏少，缺陷逃逸率偏高。' }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/mock/patternSummary.js
git commit -m "feat(special-analysis): 规律总结 mock 数据"
```

---

### Task 22: PatternSummary.vue（替换桩）

**Files:** Modify `pages/PatternSummary.vue`

- [ ] **Step 1: 写页面**

```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="sa-slot" :style="{ left:'2%', top:'18%', width:'32%', height:'72%' }">
      <heatmap-chart :x-labels="data.heatmap.xLabels" :y-labels="data.heatmap.yLabels" :points="data.heatmap.points" :max="data.heatmap.max" />
    </div>
    <div class="sa-slot" :style="{ left:'35%', top:'18%', width:'30%', height:'72%' }">
      <donut-chart :data="data.deepCause" />
    </div>
    <div class="sa-slot pat-problems" :style="{ left:'66%', top:'18%', width:'32%', height:'72%' }">
      <div v-for="(p,i) in data.problems" :key="i" class="pat-item">
        <div class="pat-head"><span class="pat-title">{{ p.title }}</span>
          <span class="pat-val num-tech">{{ p.value }}<small class="pat-pct">({{ p.pct }})</small></span></div>
        <div class="pat-desc">{{ p.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-pattern.png'
import { getPatternData } from '../api/specialApi'
import HeatmapChart from '../components/HeatmapChart.vue'
import DonutChart from '../components/DonutChart.vue'

export default {
  name: 'SaPatternSummary',
  components: { HeatmapChart, DonutChart },
  data () {
    return { bg, data: { heatmap: { xLabels: [], yLabels: [], points: [], max: 20 }, deepCause: [], problems: [] } }
  },
  async mounted () { this.data = await getPatternData() }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.pat-problems { padding: 16px; gap: 14px; overflow: auto; background: rgba(6,26,51,.88); }
.pat-item { border-left: 3px solid @sit-cyan; padding-left: 12px; }
.pat-head { display:flex; justify-content:space-between; align-items:baseline; }
.pat-title { color:@sit-text; font-size:16px; font-weight:600; }
.pat-val { font-size:26px; color:@sit-cyan; }
.pat-pct { font-size:13px; color:@sit-text; opacity:.7; margin-left:4px; font-weight:400; }
.pat-desc { color:@sit-text; opacity:.75; font-size:13px; line-height:1.6; margin-top:4px; }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/pages/PatternSummary.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/pages/PatternSummary.vue
git commit -m "feat(special-analysis): 规律总结页实现"
```

---

## Phase 5 — 案例分析 (CaseAnalysis) 页

### Task 23: case mock

**Files:** Modify `mock/caseAnalysis.js`

- [ ] **Step 1: 写 mock**

```js
export default {
  list: {
    columns: [
      { title: '序号', dataIndex: 'idx' },
      { title: '发生时间', dataIndex: 'time' },
      { title: '机型', dataIndex: 'model' },
      { title: '地点', dataIndex: 'place' },
      { title: '问题标题', dataIndex: 'title' },
      { title: '等级', dataIndex: 'level', level: true }
    ],
    rows: [
      { key: '1', idx: 1, time: '2026-07-04', model: 'A-31', place: '试验站', title: '地面联试偶发告警', level: '严重' },
      { key: '2', idx: 2, time: '2026-07-04', model: 'B-17', place: '附件厂', title: '压力波次超差', level: '重大' },
      { key: '3', idx: 3, time: '2026-07-04', model: 'A-29', place: '一线', title: '固定间距不一致', level: '一般' },
      { key: '4', idx: 4, time: '2026-07-04', model: 'C-08', place: '实验室', title: '高低温循环后通信异常', level: '严重' }
    ]
  },
  detailSteps: ['现象', '数据回放', '原因定位', '措施验证', '标准固化']
}
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/mock/caseAnalysis.js
git commit -m "feat(special-analysis): 案例分析 mock 数据"
```

---

### Task 24: CaseAnalysis.vue（替换桩；详情画板 Phase1 仅壳）

**Files:** Modify `pages/CaseAnalysis.vue`

- [ ] **Step 1: 写页面**

```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <!-- 左：典型案例列表 -->
    <div class="sa-slot" :style="{ left:'2%', top:'18%', width:'38%', height:'72%' }">
      <data-table :columns="data.list.columns" :rows="data.list.rows" :table-height="520" />
    </div>
    <!-- 右：案例详情画板（Phase1 壳） -->
    <div class="sa-slot case-detail" :style="{ left:'42%', top:'18%', width:'56%', height:'72%' }">
      <div class="case-detail__empty">选中左侧案例查看详情</div>
      <div class="case-detail__steps">
        <a-button v-for="s in data.detailSteps" :key="s" class="case-step" @click="onStep(s)">{{ s }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import bg from '../assets/bg-case.png'
import { getCaseData } from '../api/specialApi'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'SaCaseAnalysis',
  components: { DataTable },
  data () {
    return { bg, data: { list: { columns: [], rows: [] }, detailSteps: [] } }
  },
  async mounted () { this.data = await getCaseData() },
  methods: {
    onStep (s) { message.info(`「${s}」建设中`) }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.case-detail { display:flex; flex-direction:column; background: rgba(6,26,51,.6); }
.case-detail__empty { flex:1; display:flex; align-items:center; justify-content:center; color:@sit-text; opacity:.5; font-size:18px; }
.case-detail__steps { display:flex; justify-content:center; gap:14px; padding:16px; }
.case-step.ant-btn { background:rgba(24,144,255,.12); color:@sit-cyan; border:1px solid @sit-panel-border; border-radius:16px; }
.case-step.ant-btn:hover { background:rgba(0,229,255,.18); border-color:@sit-cyan; }
</style>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/pages/CaseAnalysis.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/pages/CaseAnalysis.vue
git commit -m "feat(special-analysis): 案例分析页实现（详情画板 Phase1 壳）"
```

---

## Phase 6 — 专项分析 (Special) 页

### Task 25: special mock

**Files:** Modify `mock/special.js`

- [ ] **Step 1: 写 mock**

```js
export default {
  gantt: {
    rows: [
      { name: '高发系统整治', segments: [{ start: 0, end: 5 }] },
      { name: '重复性问题清零', segments: [{ start: 2, end: 8 }] },
      { name: '薄弱环节攻关', segments: [{ start: 4, end: 9 }] },
      { name: '供应链提升', segments: [{ start: 6, end: 11 }] }
    ],
    monthCount: 11
  },
  capability: [
    { title: '预警机制建设', desc: '建立分级阈值，趋势偏离和重复性问题自动预警。' },
    { title: '指标体系搭建', desc: '完善型号、系统、单位、阶段四级质量指标。' },
    { title: '可视化大屏应用', desc: '形成月度态势、专项治理和风险督办联动驾驶舱。' },
    { title: '智能分析模型引入', desc: '引入关联规则、异常检测和归零周期预测模型。' }
  ],
  safeguard: [
    { title: '组织保障', desc: '建立型号总师、质量、工艺、供应链联合例会和督办机制。' },
    { title: '技术保障', desc: '强化仿真、试验、故障复现和技术归零专家资源投入。' },
    { title: '制度保障', desc: '完善超期归零问责、重复问题清零和供应商质量评价制度。' },
    { title: '数据保障', desc: '打通问题登记、处置、验证、关闭全链路数据口径。' }
  ],
  goals: [
    { label: '质量稳定性提升', value: 72 },
    { label: '问题发生率下降', value: 35 },
    { label: '闭环效率提升', value: 82 },
    { label: '预警能力增强', value: 67 }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis/mock/special.js
git commit -m "feat(special-analysis): 专项分析 mock 数据"
```

---

### Task 26: Special.vue（替换桩）

**Files:** Modify `pages/Special.vue`

- [ ] **Step 1: 写页面**

```vue
<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <!-- 上排 3 面板 -->
    <div class="sa-slot" :style="{ left:'2%', top:'18%', width:'40%', height:'40%' }">
      <stacked-bar-chart gantt :gantt-rows="data.gantt.rows" :month-count="data.gantt.monthCount" />
    </div>
    <div class="sa-slot" :style="{ left:'43%', top:'18%', width:'27%', height:'40%' }">
      <numbered-list :items="data.capability" />
    </div>
    <div class="sa-slot" :style="{ left:'71%', top:'18%', width:'27%', height:'40%' }">
      <numbered-list :items="data.safeguard" />
    </div>
    <!-- 下排 4 仪表盘 -->
    <div v-for="(g,i) in data.goals" :key="i" class="sa-slot"
         :style="{ left: (2 + i*24) + '%', top:'62%', width:'22%', height:'28%' }">
      <gauge-bar :item="g" />
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-special.png'
import { getSpecialData } from '../api/specialApi'
import StackedBarChart from '../components/StackedBarChart.vue'
import NumberedList from '../components/NumberedList.vue'
import GaugeBar from '../components/GaugeBar.vue'

export default {
  name: 'SaSpecial',
  components: { StackedBarChart, NumberedList, GaugeBar },
  data () {
    return { bg, data: { gantt: { rows: [], monthCount: 11 }, capability: [], safeguard: [], goals: [] } }
  },
  async mounted () { this.data = await getSpecialData() }
}
</script>
```

- [ ] **Step 2: lint + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/pages/Special.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/pages/Special.vue
git commit -m "feat(special-analysis): 专项分析页实现"
```

---

## Phase 7 — 最终验证与打磨

### Task 27: 全量构建验证

- [ ] **Step 1: 全量 lint**

Run: `cd ant-design-vue-jeecg && npm run lint 2>&1 | tail -15`
Expected: 无 error。有 error 就修。

- [ ] **Step 2: 构建（捕获编译错）**

Run: `cd ant-design-vue-jeecg && npm run build:test 2>&1 | tail -25`
Expected: 构建成功（`Build complete`）。若报模块解析错（路径/拼写），按报错修。

- [ ] **Step 3: 若有修复则 commit**

```bash
git add -A
git commit -m "fix(special-analysis): 构建问题修复"
```

---

### Task 28: 五页可视对照 + 坐标微调（对照 bg 烘焙槽位）

- [ ] **Step 1: 起服务逐页对照**

Run: `cd ant-design-vue-jeecg && npm run serve`

对每个子页（overall/special/workplan/case/pattern），对照该页 bg 烘焙的面板边框/标题，微调 `pages/*.vue` 里各 `.sa-slot` 的 `left/top/width/height` 百分比，使 overlay：
1. 落在烘焙面板内部（不压住烘焙标题文字）；
2. 不露出 bg 烘焙的示例数字/图表（必要时把 `.sa-slot` 背景 `rgba(6,26,51,.92)` 调到更不透明）；
3. 代码 header（SituationHeader + SubTabs）盖住 bg 烘焙标题，内容起始 `top` 从 ~14% 起避免被 header 遮挡。

- [ ] **Step 2: FineVis 水印遮盖**

每页 bg 右下角有 FineVis 水印。在 `specialAnalysis.less` 的 `.sa-page` 末尾加一个伪元素遮盖，或各页加一个绝对定位深色小块覆盖右下角。统一加在 less：

```less
.sa-page::after {
  content: '';
  position: absolute;
  right: 0; bottom: 0;
  width: 360px; height: 30px;
  background: #061a33;
  z-index: 5;
}
```

- [ ] **Step 3: Commit**

```bash
git add ant-design-vue-jeecg/src/views/specialAnalysis
git commit -m "style(special-analysis): 对照设计图微调叠层坐标与水印遮盖"
```

---

### Task 29: 子 tab 底图替换为切图（可选打磨）

- [ ] **Step 1: 修改 SubTabs.vue，用 `assets/tabs/*.png` 作 tab 底图**

把 SubTabs.vue 的 `<script>` 与 `.sa-subtab` 样式改为：常态用切图底图+半透明，active 用切图底图+全亮发光。具体：

```vue
<!-- template 内 .sa-subtab 加 :style，绑定 active 时的发光；常态/active 都用切图底图 -->
```
（实现时打开 `assets/tabs/*.png` 确认其是「按钮底图」还是「active 态」，按实际样式适配。若切图含文字，则去掉模板里的 `{{ t.label }}` 文字。）

- [ ] **Step 2: lint + 可视验证 + Commit**

```bash
cd ant-design-vue-jeecg && npm run lint -- --no-fix src/views/specialAnalysis/SubTabs.vue 2>&1 | tail -3
git add ant-design-vue-jeecg/src/views/specialAnalysis/SubTabs.vue
git commit -m "style(special-analysis): 子 tab 改用切图底图"
```

---

## 完成标准

- [ ] `npm run lint` 与 `npm run build:test` 均无错。
- [ ] `/situation` 点「专题分析」→ 进 `/special-analysis/overall`。
- [ ] 5 个子 tab 可切换，每页 bg + 图表/表格正确渲染，数据来自 mock。
- [ ] 顶导 SituationHeader 与首页态势一致，点「总体态势」回首页。
- [ ] overlay 落在 bg 烘焙槽位内、FineVis 水印被遮盖。

## 后续（不在本计划）

- Phase2：`api/specialApi.js` 改 axios，后端从数据库取数。
- 案例分析详情画板与 5 步交互的完整实现。
- 维度/联动筛选下拉。
