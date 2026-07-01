# 首页态势大屏（Phase 1）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `ant-design-vue-jeecg`（Vue2）工程内，像素级复刻 `设计图首页.png` 的全屏"首页态势大屏"，作为系统登录后的落地入口，使用 Mock 数据并预留真实接口。

**Architecture:** 大屏为 `constantRouterMap` 中的静态、无布局路由 `/situation`（全视口）。ECharts 5 做图表，纯 Less 手写科技边框面板。数据走 `api/situationApi.js`（Phase 1 返回 Mock，Phase 2 换真接口，组件不动）。1920×1080 设计稿 + `transform: scale()` 等比缩放适配。

**Tech Stack:** Vue 2.6 · Ant Design Vue 1.7.2 · ECharts 5（新增）· Less · vue-cli-service（`npm run serve/build/lint`）。

**Spec:** `docs/superpowers/specs/2026-07-01-situation-homepage-design.md`

---

## 关于"测试"的重要说明（务必先读）

本工程**未配置任何 JS 测试运行器**（无 jest / @vue/test-utils / vue-cli-plugin-unit-jest），且本 Phase 的工作是**视觉复刻**。因此本计划**不写单元测试**——这与 spec §7 的验收标准一致。每个任务的验证方式统一为：

1. `cd ant-design-vue-jeecg && npm run lint` —— 必须 0 error。
2. 关键节点 `npm run build` —— 必须构建成功。
3. `npm run serve` 后人工对照 `设计图首页.png` 目检（版面/配色/图表/中文标签），并打开浏览器控制台确认无报错。

纯逻辑（如 `useScale.js` 的缩放计算）尽量写成独立小函数，便于将来补测。

## 工作目录与命令约定

- 所有前端命令均在 `ant-design-vue-jeecg/` 下执行。
- 包管理：优先 `npm`；若 `npm install echarts` 因网络失败，使用镜像：
  `npm install echarts@^5.5.0 --registry https://registry.npmmirror.com --save`
- 文件路径均相对于仓库根 `quality-safety-situation/`。
- ⚠️ 标记 = 该处中文文案为从设计图 OCR 得出，实现时**对照 `设计图首页.png` 核对**再定稿。

## 文件结构总览（本计划产出）

```
ant-design-vue-jeecg/
  package.json                                    # 修改：新增 echarts 依赖
  src/
    config/router.config.js                       # 修改：constantRouterMap 增 /situation
    views/user/Login.vue                          # 修改：loginSuccess 落地改为 /situation
    views/situation/
      index.vue                                   # 创建：大屏主页（scale 壳 + 三列网格）
      useScale.js                                 # 创建：1920×1080 等比缩放 mixin
      situation.less                              # 创建：大屏级样式 + .tech-panel
      components/
        BaseChart.vue                             # 创建：ECharts 薄封装
        TechPanel.vue                             # 创建：可复用科技边框面板
        MetricBar.vue                             # 创建：可复用指标条
        RiskListItem.vue                          # 创建：可复用风险/预测条目
        SituationHeader.vue                       # 创建：顶部 Header
        CenterMap.vue                             # 创建：中国地图
        DisposalProgress.vue                      # 创建：处置措施进展
        NarrativeBox.vue                          # 创建：AI 态势解读
      modules/
        LeftColumn.vue                            # 创建：左列组合
        RightColumn.vue                           # 创建：右列组合
      mock/
        header.js  qualityIndicators.js  riskList.js  centerMap.js
        taskIndicators.js  disposal.js  narrative.js  prediction.js
      api/
        situationApi.js                           # 创建：Mock→真接口切换层
      theme/
        echarts-theme.json                        # 创建：统一图表主题
        variables.less                            # 创建：颜色/字体 token
      assets/
        china.geo.json                            # 创建：中国地图 GeoJSON（下载）
```

---

## Task 1：安装 echarts + 脚手架与样式 token

**Files:**
- Modify: `ant-design-vue-jeecg/package.json`（echarts 依赖）
- Create: `ant-design-vue-jeecg/src/views/situation/theme/variables.less`
- Create: `ant-design-vue-jeecg/src/views/situation/theme/echarts-theme.json`
- Create: `ant-design-vue-jeecg/src/views/situation/situation.less`

- [ ] **Step 1：安装 echarts**

```bash
cd ant-design-vue-jeecg
npm install echarts@^5.5.0 --save
```
若失败：`npm install echarts@^5.5.0 --registry https://registry.npmmirror.com --save`

- [ ] **Step 2：创建颜色/字体 token**

`src/views/situation/theme/variables.less`：

```less
// 大屏设计 token（对照 设计图首页.png）
@sit-bg: #0a1a2a;
@sit-panel-bg: #0f2a4a;
@sit-panel-border: #1e4a7a;
@sit-red: #ff4d4f;
@sit-yellow: #faad14;
@sit-blue: #40a9ff;
@sit-text: #ffffff;
@sit-text-dim: #8fb3d9;

// 字体：中文 + 科技等宽数字
@sit-font-cn: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
@sit-font-num: 'Rajdhani', 'DIN', 'Noto Sans SC', sans-serif;
```

- [ ] **Step 3：创建统一图表主题**

`src/views/situation/theme/echarts-theme.json`：

```json
{
  "color": ["#40a9ff", "#36cfc9", "#faad14", "#ff4d4f", "#9254de", "#52c41a"],
  "backgroundColor": "transparent",
  "textStyle": { "color": "#ffffff", "fontFamily": "Noto Sans SC, Microsoft YaHei, sans-serif" },
  "title": { "textStyle": { "color": "#ffffff" } },
  "legend": { "textStyle": { "color": "#8fb3d9" } },
  "tooltip": {
    "backgroundColor": "rgba(15,42,74,0.95)",
    "borderColor": "#1e4a7a",
    "textStyle": { "color": "#ffffff" }
  },
  "categoryAxis": {
    "axisLine": { "lineStyle": { "color": "#1e4a7a" } },
    "axisTick": { "lineStyle": { "color": "#1e4a7a" } },
    "axisLabel": { "color": "#8fb3d9" },
    "splitLine": { "lineStyle": { "color": "rgba(30,74,122,0.4)" } }
  },
  "valueAxis": {
    "axisLine": { "lineStyle": { "color": "#1e4a7a" } },
    "axisTick": { "lineStyle": { "color": "#1e4a7a" } },
    "axisLabel": { "color": "#8fb3d9" },
    "splitLine": { "lineStyle": { "color": "rgba(30,74,122,0.4)" } }
  }
}
```

- [ ] **Step 4：创建大屏级样式 + 可复用 `.tech-panel`**

`src/views/situation/situation.less`：

```less
@import './theme/variables.less';

.situation-screen {
  position: fixed; inset: 0;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(ellipse at center, #123a5e 0%, @sit-bg 70%);
}

// 可复用科技边框面板
.tech-panel {
  position: relative;
  background: @sit-panel-bg;
  border: 1px solid @sit-panel-border;
  border-radius: 4px;
  display: flex; flex-direction: column;

  &__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px;
    border-bottom: 1px solid rgba(30, 74, 122, 0.6);
  }
  &__title { color: @sit-text; font-size: 15px; font-weight: 700; letter-spacing: 1px; }
  &__tab { color: @sit-blue; font-size: 12px; }
  &__body { flex: 1; padding: 10px 14px; overflow: hidden; }

  // 四角科技角标
  &::before, &::after {
    content: ''; position: absolute; width: 10px; height: 10px;
    border-color: @sit-blue; border-style: solid; border-width: 0;
  }
  &::before { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
  &::after  { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }
}

.num-tech { font-family: @sit-font-num; font-weight: 700; }
```

- [ ] **Step 5：验证 lint 通过**

```bash
npm run lint
```
Expected：0 error（新文件无语法问题）。

- [ ] **Step 6：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/package.json ant-design-vue-jeecg/package-lock.json ant-design-vue-jeecg/src/views/situation
git commit -m "feat(situation): 安装 echarts，新增样式 token 与科技面板基类"
```

---

## Task 2：BaseChart.vue（ECharts 薄封装）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/components/BaseChart.vue`

- [ ] **Step 1：实现 BaseChart.vue**

```vue
<template>
  <div ref="el" class="base-chart"></div>
</template>

<script>
import * as echarts from 'echarts'
import theme from '../theme/echarts-theme.json'

let themeRegistered = false
function ensureTheme () {
  if (!themeRegistered) {
    echarts.registerTheme('situation', theme)
    themeRegistered = true
  }
}

export default {
  name: 'BaseChart',
  props: {
    option: { type: Object, required: true }
  },
  data () {
    return { chart: null }
  },
  watch: {
    option: { deep: true, handler () { this.render() } }
  },
  mounted () {
    ensureTheme()
    this.chart = echarts.init(this.$refs.el, 'situation')
    this.render()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    if (this.chart) { this.chart.dispose(); this.chart = null }
  },
  methods: {
    render () { if (this.chart) this.chart.setOption(this.option, true) },
    onResize () { if (this.chart) this.chart.resize() }
  }
}
</script>

<style scoped>
.base-chart { width: 100%; height: 100%; }
</style>
```

- [ ] **Step 2：lint**

```bash
cd ant-design-vue-jeecg && npm run lint
```
Expected：0 error。

- [ ] **Step 3：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/components/BaseChart.vue
git commit -m "feat(situation): 新增 BaseChart ECharts 封装"
```

---

## Task 3：路由 `/situation` + 登录落地改为大屏

**Files:**
- Modify: `ant-design-vue-jeecg/src/config/router.config.js`（`constantRouterMap`，第 296 行起）
- Modify: `ant-design-vue-jeecg/src/views/user/Login.vue`（`loginSuccess`，约第 129–131 行）

- [ ] **Step 1：在 constantRouterMap 顶部新增 /situation 静态路由**

打开 `src/config/router.config.js`，定位 `export const constantRouterMap = [`（第 296 行）。在其后数组首项插入：

```js
  {
    path: '/situation',
    name: 'situation',
    component: () => import('@/views/situation/index'),
    meta: { title: '首页态势' }
  },
```

> 说明：顶层路由、component 直接指向大屏页面、**不套任何 layout**，故为全视口。`/situation` 属 constantRouterMap，始终可用，不受后端菜单控制；权限守卫仍要求登录态（符合"登录后落地大屏"）。

- [ ] **Step 2：登录成功后落地到 /situation**

打开 `src/views/user/Login.vue`，定位 `loginSuccess ()`（约第 129 行）。将：

```js
this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
```

改为：

```js
this.$router.push({ path: "/situation" }).catch(()=>{
```

- [ ] **Step 3：暂时在 views/situation/ 放一个占位 index.vue 以便验证路由**

`src/views/situation/index.vue`（占位，下个任务替换）：

```vue
<template>
  <div style="position:fixed;inset:0;background:#0a1a2a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">
    首页态势大屏（占位）
  </div>
</template>
<script>
export default { name: 'SituationIndex' }
</script>
```

- [ ] **Step 4：验证 lint**

```bash
cd ant-design-vue-jeecg && npm run lint
```
Expected：0 error。

- [ ] **Step 5：验证路由（人工）**

```bash
npm run serve
```
登录后应自动跳转 `/situation` 并显示深蓝占位页；直接访问 `http://localhost:3000/situation`（端口以输出为准）也应显示占位页。确认后 Ctrl+C 停止。

- [ ] **Step 6：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/config/router.config.js ant-design-vue-jeecg/src/views/user/Login.vue ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): 新增 /situation 路由，登录后落地大屏"
```

---

## Task 4：useScale（缩放适配）+ 大屏主页骨架

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/useScale.js`
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（替换 Task 3 占位）

- [ ] **Step 1：实现缩放 mixin**

`src/views/situation/useScale.js`：

```js
// 1920×1080 设计稿等比缩放：按视口最小比例缩放并居中
const DESIGN_W = 1920
const DESIGN_H = 1080

export default {
  data () {
    return { scaleStyle: {} }
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
        left: '50%',
        top: '50%',
        transformOrigin: 'center center',
        transform: `translate(-50%, -50%) scale(${s})`
      }
    }
  }
}
```

- [ ] **Step 2：实现大屏主页骨架（三列网格）**

`src/views/situation/index.vue`（替换占位）：

```vue
<template>
  <div class="situation-screen">
    <div class="situation-stage" :style="scaleStyle">
      <div class="situation-row situation-header-row"><!-- Header 占位，下个任务接入 --></div>
      <div class="situation-body">
        <div class="col col-left">左列占位</div>
        <div class="col col-center">中列占位</div>
        <div class="col col-right">右列占位</div>
      </div>
    </div>
  </div>
</template>

<script>
import useScale from './useScale'
export default {
  name: 'SituationIndex',
  mixins: [useScale]
}
</script>

<!-- 全局：共享大屏类（.situation-screen / .tech-panel / .num-tech）供所有子组件使用 -->
<style lang="less">
@import './situation.less';
</style>

<!-- 本页布局（scoped） -->
<style lang="less" scoped>
.situation-stage { box-sizing: border-box; display: flex; flex-direction: column; }
.situation-header-row { height: 80px; flex: 0 0 80px; }
.situation-body {
  flex: 1; display: grid;
  grid-template-columns: 420px 1fr 420px;
  gap: 12px; padding: 0 12px 12px;
}
.col {
  display: flex; flex-direction: column; gap: 12px;
  color: #fff; justify-content: center; align-items: center;
  font-size: 18px;
}
</style>
```

- [ ] **Step 3：lint**

```bash
cd ant-design-vue-jeecg && npm run lint
```
Expected：0 error。

- [ ] **Step 4：验证缩放（人工）**

```bash
npm run serve
```
访问 `/situation`：深蓝背景上出现三列占位文字；改变浏览器窗口大小，内容等比缩放居中、不出现滚动条、不变形。确认后停止。

- [ ] **Step 5：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/useScale.js ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): 1920×1080 等比缩放 + 三列网格骨架"
```

---

## Task 5：数据层（api + 全部 mock）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/mock/header.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/qualityIndicators.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/riskList.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/centerMap.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/taskIndicators.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/disposal.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/narrative.js`
- Create: `ant-design-vue-jeecg/src/views/situation/mock/prediction.js`
- Create: `ant-design-vue-jeecg/src/views/situation/api/situationApi.js`

> 数据形状 = 未来真实接口返回结构；数值取自 `设计图首页.png`。⚠️ 中文文案定稿时对照设计图核对。

- [ ] **Step 1：header mock**

`mock/header.js`：

```js
export default {
  title: '航空装备质量安全态势·主动防御大屏',
  navTabs: ['总体态势', '态势改版', '画像中心', '专题分析', '分析工作台', '指标与模型', '全链路留痕'], // ⚠️核对
  filters: {
    base: '基地·机队分队',
    role: '综合视图(不过滤)'
  },
  kpi: [
    { label: '飞机数', value: 240, unit: '架' },
    { label: '飞行小时数', value: 18000, unit: 'h/日' },
    { label: '在修数', value: 18, unit: '架' },
    { label: '综合指数', value: 82.1, unit: '分' }
  ],
  safety: [
    { label: '事故数', value: 0, unit: '起' },
    { label: '事故征候数', value: 3, unit: '起' },
    { label: '质量问题数', value: 156, unit: '项' },
    { label: '问题处置用户满意度', value: 96, unit: '%' }
  ],
  alertBtn: '总体态势预警'
}
```

- [ ] **Step 2：qualityIndicators mock（左列上）**

`mock/qualityIndicators.js`：

```js
export default [
  { id: 'q1', label: '机械原因事故万时率', value: '0.00', note: '低于红线，未破限', level: 'green' },
  { id: 'q2', label: '事故征候千时率', value: '0.83', note: '连续 2 期上升', level: 'yellow' },
  { id: 'q3', label: '飞机故障率', value: '4.7%', note: '较基线 +0.6pp', level: 'yellow' },
  { id: 'q4', label: '空地故障比', value: '1:3.1', note: '空中告警占比上升', level: 'yellow' },
  { id: 'q5', label: '0小时故障占比', value: '7.4%', note: 'B23 批次偏高', level: 'red' }
]
```

- [ ] **Step 3：riskList mock（左列下）**

`mock/riskList.js`：

```js
export default [
  {
    id: 'r1', severity: 'red',
    title: '0小时故障批次集中', owner: '型号A团队', tag: '整改验证',
    detail: '关联问题 17 项，5 项复现；0 小时故障占比高于均值 2.1 倍。'
  },
  {
    id: 'r2', severity: 'yellow',
    title: '空地故障比走高', owner: '型号A团队', tag: '整改验证',
    detail: '空中告警占比连续上升，地面复现率偏低，存在漏判风险。'
  }
]
```

- [ ] **Step 4：centerMap mock（中列）**

`mock/centerMap.js`：

```js
// 经纬度为示例占位（中国主要城市）；Phase2 换真实基地坐标
export default {
  // 地图上的保障区/基地散点
  points: [
    { name: '北部保障基地', value: [116.4, 39.9], level: 'red' },
    { name: '中部保障区', value: [113.6, 34.7], level: 'yellow' },
    { name: '南部保障基地', value: [113.2, 23.1], level: 'green' }
  ],
  // 飞行连线（指挥/协同）
  lines: [
    { coords: [116.4, 39.9, 113.6, 34.7] },
    { coords: [113.6, 34.7, 113.2, 23.1] }
  ],
  // 底部子 Tab
  subTabs: ['最需关注TOP3', '某基地·机队分队', '协同预警', '中部保障区', '命中', '北部保障基地', '无键命中'] // ⚠️核对
}
```

- [ ] **Step 5：taskIndicators mock（右列上）**

`mock/taskIndicators.js`：

```js
export default [
  { id: 't1', label: '在队完好率', value: '88%', note: '较目标 -1.6pp', level: 'yellow' },
  { id: 't2', label: '误飞千次率', value: '2.1', note: '训练高峰后回落', level: 'green' },
  { id: 't3', label: '故障任务影响占比', value: '14%', note: '任务恢复压力上升', level: 'yellow' },
  { id: 't4', label: '任务影响平均时间', value: '3.2h', note: '较目标 +0.8h', level: 'red' },
  { id: 't5', label: '日使用强度区间', value: '1.2-1.8', note: '两单位高位运行', level: 'yellow' }
]
```

- [ ] **Step 6：disposal mock（右列中）**

`mock/disposal.js`：

```js
export default {
  summary: [
    { label: '操作单', value: 2 },
    { label: '技术单', value: 1 },
    { label: '管理单', value: 2 },
    { label: '已闭环', value: '1/5' }
  ],
  item: {
    type: '操作', title: 'B23 批次 0 小时件停用换装', status: '执行中',
    detail: '对应 0 小时故障批次集中；在装机件已停用 5 项，换装到位 3/5，重磨识聚集中比回落中。' // ⚠️核对
  }
}
```

- [ ] **Step 7：narrative mock（右列下-叙事）**

`mock/narrative.js`：

```js
export default [
  { title: '态势判断', text: '总体当前标记为样本充分。综合指数走低与在修数上升是本次叙事线的重要观察项。' }, // ⚠️核对
  { title: '关联推断', text: 'A 小时故障率与空中告警故障比主变方向上同向，班机同一专列。' } // ⚠️核对
]
```

- [ ] **Step 8：prediction mock（右列下-预测）**

`mock/prediction.js`：

```js
export default [
  { id: 'p1', severity: 'red', title: '该批次故障率或继续上行', tag: '提前排查', detail: '相似工况样本中告警先导特征已出现。', confidence: 82 },
  { id: 'p2', severity: 'yellow', title: '完好率或跌破目标线', tag: '提前排查', detail: '', confidence: 82 }
]
```

- [ ] **Step 9：api 切换层**

`api/situationApi.js`：

```js
// Phase1：返回 mock；Phase2 后端就绪时，将每个函数体改为真实 axios 请求（见注释），组件无需改动。
// 约定：每个函数对应一个后端接口。
import headerMock from '../mock/header'
import qualityMock from '../mock/qualityIndicators'
import riskMock from '../mock/riskList'
import centerMapMock from '../mock/centerMap'
import taskMock from '../mock/taskIndicators'
import disposalMock from '../mock/disposal'
import narrativeMock from '../mock/narrative'
import predictionMock from '../mock/prediction'

// GET /situation/header
export function getSituationHeader () { return Promise.resolve(headerMock) }
// GET /situation/quality-indicators
export function getQualityIndicators () { return Promise.resolve(qualityMock) }
// GET /situation/risks
export function getRiskList () { return Promise.resolve(riskMock) }
// GET /situation/center-map
export function getCenterMap () { return Promise.resolve(centerMapMock) }
// GET /situation/task-indicators
export function getTaskIndicators () { return Promise.resolve(taskMock) }
// GET /situation/disposal
export function getDisposal () { return Promise.resolve(disposalMock) }
// GET /situation/narrative
export function getNarrative () { return Promise.resolve(narrativeMock) }
// GET /situation/prediction
export function getPrediction () { return Promise.resolve(predictionMock) }
```

- [ ] **Step 10：lint + 提交**

```bash
cd ant-design-vue-jeecg && npm run lint
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/mock ant-design-vue-jeecg/src/views/situation/api
git commit -m "feat(situation): 新增 Mock 数据与 api 切换层（预留真实接口）"
```

---

## Task 6：可复用组件（TechPanel / MetricBar / RiskListItem）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/components/TechPanel.vue`
- Create: `ant-design-vue-jeecg/src/views/situation/components/MetricBar.vue`
- Create: `ant-design-vue-jeecg/src/views/situation/components/RiskListItem.vue`

- [ ] **Step 1：TechPanel.vue（标题 + tab + 角标 + 内容 slot）**

```vue
<template>
  <section class="tech-panel">
    <header class="tech-panel__header">
      <span class="tech-panel__title">{{ title }}</span>
      <span v-if="tab" class="tech-panel__tab">{{ tab }}</span>
    </header>
    <div class="tech-panel__body"><slot /></div>
  </section>
</template>

<script>
export default {
  name: 'TechPanel',
  props: {
    title: { type: String, required: true },
    tab: { type: String, default: '' }
  }
}
</script>

<style lang="less" scoped>
/* .tech-panel / .tech-panel__* 由 index.vue 全局引入的 situation.less 提供，此处无需重复定义 */
</style>
```

- [ ] **Step 2：MetricBar.vue（指标条：标签 + 大号数值 + 趋势 + 迷你进度）**

```vue
<template>
  <div class="metric-bar" :class="'lvl-' + level" @click="$emit('drill')">
    <div class="metric-bar__main">
      <span class="metric-bar__label">{{ item.label }}</span>
      <span class="metric-bar__value num-tech">{{ item.value }}</span>
    </div>
    <div class="metric-bar__note">
      <span class="dot" />
      <span>{{ item.note }}</span>
    </div>
    <div class="metric-bar__track"><div class="metric-bar__fill" :style="{ width: pct }" /></div>
  </div>
</template>

<script>
const PCT = { q1: 10, q2: 45, q3: 47, q4: 75, q5: 74, t1: 88, t2: 21, t3: 14, t4: 64, t5: 60 }
export default {
  name: 'MetricBar',
  props: {
    item: { type: Object, required: true }, // { id, label, value, note, level }
    level: { type: String, default: 'green' }
  },
  computed: {
    pct () {
      const v = PCT[this.item.id]
      return (v == null ? 50 : v) + '%'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.metric-bar { padding: 6px 0; cursor: pointer; }
.metric-bar__main { display: flex; align-items: baseline; justify-content: space-between; }
.metric-bar__label { color: @sit-text-dim; font-size: 13px; }
.metric-bar__value { color: @sit-text; font-size: 26px; }
.metric-bar__note { display: flex; align-items: center; gap: 6px; color: @sit-text-dim; font-size: 12px; margin-top: 2px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: @sit-blue; }
.lvl-yellow .dot { background: @sit-yellow; }
.lvl-yellow .metric-bar__value { color: @sit-yellow; }
.lvl-red .dot { background: @sit-red; }
.lvl-red .metric-bar__value { color: @sit-red; }
.metric-bar__track { height: 3px; background: rgba(30,74,122,0.5); border-radius: 2px; margin-top: 6px; }
.metric-bar__fill { height: 100%; background: @sit-blue; border-radius: 2px; }
.lvl-yellow .metric-bar__fill { background: @sit-yellow; }
.lvl-red .metric-bar__fill { background: @sit-red; }
</style>
```

- [ ] **Step 3：RiskListItem.vue（红/黄圆点 + 标题 + 标签 + 子说明）**

```vue
<template>
  <div class="risk-item" :class="'sev-' + item.severity" @click="$emit('drill', item)">
    <div class="risk-item__head">
      <span class="risk-item__dot" />
      <span class="risk-item__title">{{ item.title }}</span>
      <span v-if="item.owner" class="risk-item__owner">/ {{ item.owner }}</span>
      <span v-if="tagText" class="risk-item__tag">{{ tagText }}</span>
    </div>
    <div class="risk-item__detail">
      {{ item.detail }}
      <span v-if="item.confidence != null" class="risk-item__conf">置信度 {{ item.confidence }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskListItem',
  props: { item: { type: Object, required: true } },
  computed: {
    tagText () { return this.item.tag || (this.item.status ? this.item.status : '') }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.risk-item { padding: 8px 0; border-bottom: 1px dashed rgba(30,74,122,0.5); cursor: pointer; }
.risk-item:last-child { border-bottom: 0; }
.risk-item__head { display: flex; align-items: center; gap: 8px; }
.risk-item__dot { width: 8px; height: 8px; border-radius: 50%; background: @sit-blue; flex: 0 0 8px; }
.sev-red .risk-item__dot { background: @sit-red; }
.sev-yellow .risk-item__dot { background: @sit-yellow; }
.risk-item__title { color: @sit-text; font-size: 14px; font-weight: 600; }
.risk-item__owner { color: @sit-text-dim; font-size: 12px; }
.risk-item__tag { margin-left: auto; color: @sit-blue; font-size: 11px; border: 1px solid @sit-blue; border-radius: 2px; padding: 0 6px; }
.risk-item__detail { color: @sit-text-dim; font-size: 12px; margin-top: 4px; padding-left: 16px; line-height: 1.5; }
.risk-item__conf { color: @sit-yellow; margin-left: 6px; }
</style>
```

- [ ] **Step 4：lint + 提交**

```bash
cd ant-design-vue-jeecg && npm run lint
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/components/TechPanel.vue ant-design-vue-jeecg/src/views/situation/components/MetricBar.vue ant-design-vue-jeecg/src/views/situation/components/RiskListItem.vue
git commit -m "feat(situation): 可复用组件 TechPanel/MetricBar/RiskListItem"
```

---

## Task 7：Header（标题 + 导航 + 筛选 + KPI + 安全口径 + 时钟）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/components/SituationHeader.vue`
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（接入 Header + 数据加载）

- [ ] **Step 1：SituationHeader.vue**

```vue
<template>
  <div class="sit-header">
    <div class="sit-header__top">
      <div class="sit-header__title num-tech">{{ data.title }}</div>
      <nav class="sit-header__nav">
        <span v-for="t in data.navTabs" :key="t" class="sit-header__tab" :class="{ active: t === activeTab }" @click="$emit('nav', t)">{{ t }}</span>
      </nav>
      <div class="sit-header__ctrl">
        <span class="sit-header__filter">{{ data.filters.base }}</span>
        <span class="sit-header__filter">{{ data.filters.role }}</span>
        <button class="sit-header__alert" @click="$emit('alert')">{{ data.alertBtn }}</button>
      </div>
    </div>
    <div class="sit-header__kpi">
      <div v-for="k in data.kpi" :key="k.label" class="kpi-item">
        <span class="kpi-label">{{ k.label }}</span>
        <span class="kpi-value num-tech">{{ k.value }}<small>{{ k.unit }}</small></span>
      </div>
      <div class="kpi-sep" />
      <div class="kpi-group">
        <div v-for="s in data.safety" :key="s.label" class="kpi-item">
          <span class="kpi-label">{{ s.label }}</span>
          <span class="kpi-value num-tech">{{ s.value }}<small>{{ s.unit }}</small></span>
        </div>
      </div>
      <div class="kpi-clock num-tech">{{ clock }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SituationHeader',
  props: {
    data: { type: Object, required: true },
    activeTab: { type: String, default: '总体态势' }
  },
  data () { return { clock: '', timer: null } },
  mounted () {
    const pad = (n) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      this.clock = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }
    tick()
    this.timer = setInterval(tick, 1000)
  },
  beforeDestroy () { if (this.timer) clearInterval(this.timer) }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.sit-header { color: @sit-text; }
.sit-header__top { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 56px; }
.sit-header__title { font-size: 26px; font-weight: 700; letter-spacing: 2px;
  background: linear-gradient(180deg, #ffffff, #40a9ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sit-header__nav { display: flex; gap: 22px; }
.sit-header__tab { color: @sit-text-dim; font-size: 14px; cursor: pointer; padding: 4px 2px; }
.sit-header__tab.active { color: @sit-text; border-bottom: 2px solid @sit-blue; }
.sit-header__ctrl { display: flex; align-items: center; gap: 10px; }
.sit-header__filter { color: @sit-text-dim; font-size: 12px; border: 1px solid @sit-panel-border; border-radius: 2px; padding: 3px 10px; }
.sit-header__alert { background: @sit-red; color: #fff; border: 0; border-radius: 2px; padding: 5px 12px; cursor: pointer; font-size: 12px; }
.sit-header__kpi { display: flex; align-items: center; gap: 26px; padding: 6px 16px; border-top: 1px solid rgba(30,74,122,0.6); border-bottom: 1px solid rgba(30,74,122,0.6); }
.kpi-item { display: flex; flex-direction: column; }
.kpi-label { color: @sit-text-dim; font-size: 12px; }
.kpi-value { color: @sit-text; font-size: 22px; }
.kpi-value small { font-size: 12px; margin-left: 3px; color: @sit-text-dim; }
.kpi-sep { width: 1px; height: 28px; background: rgba(30,74,122,0.8); }
.kpi-group { display: flex; gap: 26px; }
.kpi-clock { margin-left: auto; color: @sit-blue; font-size: 16px; }
</style>
```

- [ ] **Step 2：index.vue 接入 Header 并加载数据**

将 `index.vue` 的 `<script>` 与 `<template>` 顶部替换为接入 Header（列占位暂保留，后续任务替换）：

```vue
<template>
  <div class="situation-screen">
    <div class="situation-stage" :style="scaleStyle">
      <situation-header :data="header" :active-tab="activeTab" @nav="onNav" @alert="onAlert" />
      <div class="situation-body">
        <div class="col col-left">左列占位</div>
        <div class="col col-center">中列占位</div>
        <div class="col col-right">右列占位</div>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import useScale from './useScale'
import SituationHeader from './components/SituationHeader'
import { getSituationHeader } from './api/situationApi'

export default {
  name: 'SituationIndex',
  components: { SituationHeader },
  mixins: [useScale],
  data () {
    return { header: { title: '', navTabs: [], filters: {}, kpi: [], safety: [], alertBtn: '' }, activeTab: '总体态势' }
  },
  async mounted () {
    this.header = await getSituationHeader()
  },
  methods: {
    onNav (t) { this.activeTab = t; if (t !== '总体态势') message.info(`「${t}」建设中`) },
    onAlert () { message.warning('总体态势预警（Phase1 交互壳）') }
  }
}
</script>
```
（`<style>` 保持 Task 4 内容不变。）

- [ ] **Step 3：lint + 人工验证**

```bash
cd ant-design-vue-jeecg && npm run lint && npm run serve
```
`/situation` 顶部出现标题、7 个导航 Tab、两个筛选、红色预警按钮、KPI 条（飞机数/飞行小时数/在修数/综合指数）、安全口径 4 项、右侧实时时钟每秒跳动；点击非"总体态势"Tab 弹出"建设中"提示。确认后停止。

- [ ] **Step 4：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/components/SituationHeader.vue ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): Header（标题/导航/筛选/KPI/安全口径/时钟）"
```

---

## Task 8：左列（质量安全指标 + 已识别风险清单）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/modules/LeftColumn.vue`
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（接入左列）

- [ ] **Step 1：LeftColumn.vue**

```vue
<template>
  <div class="left-col">
    <tech-panel title="质量安全评价指标" tab="态势分析">
      <metric-bar v-for="m in quality" :key="m.id" :item="m" :level="m.level" @drill="onDrill(m)" />
    </tech-panel>
    <tech-panel title="已识别风险清单" tab="风险识别">
      <risk-list-item v-for="r in risks" :key="r.id" :item="r" @drill="onDrillRisk" />
    </tech-panel>
  </div>
</template>

<script>
import TechPanel from '../components/TechPanel'
import MetricBar from '../components/MetricBar'
import RiskListItem from '../components/RiskListItem'
import { getQualityIndicators, getRiskList } from '../api/situationApi'

export default {
  name: 'LeftColumn',
  components: { TechPanel, MetricBar, RiskListItem },
  data () { return { quality: [], risks: [] } },
  async mounted () {
    this.quality = await getQualityIndicators()
    this.risks = await getRiskList()
  },
  methods: {
    onDrill (m) { this.$router.push('/sys/fault').catch(() => {}) },     // Phase2 真实下钻
    onDrillRisk (r) { this.$router.push('/sys/risk').catch(() => {}) }
  }
}
</script>

<style lang="less" scoped>
.left-col { height: 100%; display: flex; flex-direction: column; gap: 12px; }
.left-col > section { flex: 1; }
</style>
```

- [ ] **Step 2：index.vue 接入左列**

在 `index.vue`：
- `import LeftColumn from './modules/LeftColumn'`，`components` 注册 `LeftColumn`
- 模板中 `<div class="col col-left">左列占位</div>` 替换为 `<left-column class="col col-left" />`

- [ ] **Step 3：lint + 人工验证**

```bash
cd ant-design-vue-jeecg && npm run lint && npm run serve
```
左列渲染两个科技面板：上为 5 项质量安全指标（数值/趋势/进度条，红黄绿配色按 level），下为 2 条风险条目（红/黄圆点 + 标题 + 团队 + "整改验证"标签 + 子说明）。与设计图一致。确认后停止。

- [ ] **Step 4：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/modules/LeftColumn.vue ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): 左列 质量安全指标 + 已识别风险清单"
```

---

## Task 9：中列（分布态势地图）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/assets/china.geo.json`（下载）
- Create: `ant-design-vue-jeecg/src/views/situation/components/CenterMap.vue`
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（接入中列）

- [ ] **Step 1：下载中国 GeoJSON**

```bash
cd "e:/claude code projects/quality-safety-situation/ant-design-vue-jeecg/src/views/situation"
mkdir -p assets
curl -L -o assets/china.geo.json "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
ls -la assets/china.geo.json   # 应为 ~600KB–1MB 的 JSON
```
若 curl 失败：从 https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json 手动下载并放入 `assets/china.geo.json`。

- [ ] **Step 2：CenterMap.vue（注册地图 + 散点 + 飞行线 + 底部子 Tab + 小图占位）**

```vue
<template>
  <div class="center-map">
    <tech-panel :title="'分布态势地图'" tab="态势分析">
      <template v-slot:default>
        <div class="center-map__head">
          <span class="geo-filter">地理 ▾</span>
          <span class="analysis-btn">态势分析</span>
        </div>
        <div class="center-map__chart">
          <base-chart :option="option" />
        </div>
        <div class="center-map__subtabs">
          <span v-for="t in data.subTabs" :key="t" class="subtab" :class="{ active: t === activeSub }" @click="activeSub = t">{{ t }}</span>
        </div>
      </template>
    </tech-panel>
    <div class="center-map__inset"><span>局部放大</span></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaGeo from '../assets/china.geo.json'
import BaseChart from './BaseChart'
import TechPanel from './TechPanel'
import { getCenterMap } from '../api/situationApi'

let mapRegistered = false
function ensureMap () {
  if (!mapRegistered) { echarts.registerMap('china', chinaGeo); mapRegistered = true }
}

export default {
  name: 'CenterMap',
  components: { BaseChart, TechPanel },
  data () { return { data: { points: [], lines: [], subTabs: [] }, activeSub: '' } },
  computed: {
    option () {
      ensureMap()
      return {
        geo: {
          map: 'china', roam: false,
          itemStyle: { areaColor: '#0f2a4a', borderColor: '#2f6aa0' },
          emphasis: { itemStyle: { areaColor: '#16456e' } },
          label: { show: false }
        },
        series: [
          {
            type: 'effectScatter', coordinateSystem: 'geo',
            data: this.data.points.map(p => ({ name: p.name, value: p.value })),
            symbolSize: 12, rippleEffect: { scale: 4 },
            itemStyle: {
              color: (params) => ({ red: '#ff4d4f', yellow: '#faad14', green: '#52c41a' })[
                (this.data.points[params.dataIndex] || {}).level || 'blue']
            }
          },
          {
            type: 'lines', coordinateSystem: 'geo',
            data: this.data.lines.map(l => ({ coords: [[l.coords[0], l.coords[1]], [l.coords[2], l.coords[3]]] })),
            effect: { show: true, period: 5, trailLength: 0.4, symbolSize: 5 },
            lineStyle: { color: '#40a9ff', width: 1, opacity: 0.6, curveness: 0.2 }
          }
        ]
      }
    }
  },
  async mounted () {
    this.data = await getCenterMap()
    this.activeSub = this.data.subTabs[0] || ''
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.center-map { height: 100%; position: relative; display: flex; }
.center-map > section.tech-panel { flex: 1; }
.center-map__head { display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 4px; }
.geo-filter, .analysis-btn { color: @sit-blue; font-size: 12px; border: 1px solid @sit-panel-border; border-radius: 2px; padding: 2px 8px; }
.center-map__chart { flex: 1; min-height: 0; }
.center-map__subtabs { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 6px; border-top: 1px solid rgba(30,74,122,0.5); }
.subtab { color: @sit-text-dim; font-size: 12px; cursor: pointer; padding: 2px 6px; }
.subtab.active { color: @sit-text; border-bottom: 2px solid @sit-blue; }
.center-map__inset { position: absolute; right: 18px; bottom: 56px; width: 130px; height: 90px;
  border: 1px solid @sit-panel-border; background: rgba(15,42,74,0.8); color: @sit-text-dim;
  display: flex; align-items: center; justify-content: center; font-size: 12px; }
</style>
```

- [ ] **Step 3：index.vue 接入中列**

- `import CenterMap from './components/CenterMap'`，`components` 注册
- 模板 `<div class="col col-center">中列占位</div>` 替换为 `<center-map class="col col-center" />`

- [ ] **Step 4：lint + 人工验证**

```bash
cd ant-design-vue-jeecg && npm run lint && npm run serve
```
中列渲染中国地图（深蓝底、浅蓝省界），3 个脉冲散点（北部红/中部黄/南部绿）+ 2 条流动连线；上方"地理/态势分析"，下方 7 个子 Tab（可切换高亮），右下"局部放大"小框。控制台无报错。确认后停止。

- [ ] **Step 5：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/assets ant-design-vue-jeecg/src/views/situation/components/CenterMap.vue ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): 中列 分布态势地图（中国地图+散点+连线+子Tab）"
```

---

## Task 10：右列（任务能力 + 处置进展 + AI叙事 + 预测风险）

**Files:**
- Create: `ant-design-vue-jeecg/src/views/situation/components/DisposalProgress.vue`
- Create: `ant-design-vue-jeecg/src/views/situation/components/NarrativeBox.vue`
- Create: `ant-design-vue-jeecg/src/views/situation/modules/RightColumn.vue`
- Modify: `ant-design-vue-jeecg/src/views/situation/index.vue`（接入右列）

- [ ] **Step 1：DisposalProgress.vue（处置措施进展）**

```vue
<template>
  <div class="disposal">
    <div class="disposal__summary">
      <div v-for="s in data.summary" :key="s.label" class="d-item">
        <span class="d-value num-tech">{{ s.value }}</span>
        <span class="d-label">{{ s.label }}</span>
      </div>
    </div>
    <div class="disposal__item">
      <div class="d-item-head">
        <span class="d-type">{{ data.item.type }}</span>
        <span class="d-title">{{ data.item.title }}</span>
        <span class="d-status">{{ data.item.status }}</span>
      </div>
      <div class="d-detail">{{ data.item.detail }}</div>
    </div>
  </div>
</template>

<script>
export default { name: 'DisposalProgress', props: { data: { type: Object, required: true } } }
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.disposal__summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-value { color: @sit-blue; font-size: 22px; }
.d-label { color: @sit-text-dim; font-size: 12px; }
.disposal__item { margin-top: 10px; border-top: 1px dashed rgba(30,74,122,0.5); padding-top: 8px; }
.d-item-head { display: flex; align-items: center; gap: 8px; }
.d-type { color: #fff; background: @sit-blue; font-size: 11px; border-radius: 2px; padding: 1px 6px; }
.d-title { color: @sit-text; font-size: 13px; }
.d-status { margin-left: auto; color: @sit-yellow; font-size: 12px; }
.d-detail { color: @sit-text-dim; font-size: 12px; margin-top: 4px; line-height: 1.5; }
</style>
```

- [ ] **Step 2：NarrativeBox.vue（AI 态势解读）**

```vue
<template>
  <div class="narrative">
    <div v-for="n in data" :key="n.title" class="narr-block">
      <div class="narr-title">{{ n.title }}</div>
      <div class="narr-text">{{ n.text }}</div>
    </div>
  </div>
</template>

<script>
export default { name: 'NarrativeBox', props: { data: { type: Array, required: true } } }
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.narr-block { margin-bottom: 8px; }
.narr-title { color: @sit-blue; font-size: 13px; font-weight: 600; }
.narr-text { color: @sit-text-dim; font-size: 12px; line-height: 1.6; margin-top: 2px; }
</style>
```

- [ ] **Step 3：RightColumn.vue**

```vue
<template>
  <div class="right-col">
    <tech-panel title="任务能力评价指标" tab="态势分析">
      <metric-bar v-for="m in task" :key="m.id" :item="m" :level="m.level" @drill="onDrill" />
    </tech-panel>
    <tech-panel title="处置措施进展" tab="处置闭环">
      <disposal-progress :data="disposal" />
    </tech-panel>
    <tech-panel title="AI态势解读叙事线" tab="态势解读">
      <narrative-box :data="narrative" />
    </tech-panel>
    <tech-panel title="预测潜在风险" tab="预测预警">
      <risk-list-item v-for="p in prediction" :key="p.id" :item="p" />
    </tech-panel>
  </div>
</template>

<script>
import TechPanel from '../components/TechPanel'
import MetricBar from '../components/MetricBar'
import DisposalProgress from '../components/DisposalProgress'
import NarrativeBox from '../components/NarrativeBox'
import RiskListItem from '../components/RiskListItem'
import { getTaskIndicators, getDisposal, getNarrative, getPrediction } from '../api/situationApi'

export default {
  name: 'RightColumn',
  components: { TechPanel, MetricBar, DisposalProgress, NarrativeBox, RiskListItem },
  data () { return { task: [], disposal: { summary: [], item: {} }, narrative: [], prediction: [] } },
  async mounted () {
    const [t, d, n, p] = await Promise.all([getTaskIndicators(), getDisposal(), getNarrative(), getPrediction()])
    this.task = t; this.disposal = d; this.narrative = n; this.prediction = p
  },
  methods: { onDrill () { this.$router.push('/sys/task').catch(() => {}) } }
}
</script>

<style lang="less" scoped>
.right-col { height: 100%; display: flex; flex-direction: column; gap: 12px; }
.right-col > section { flex: 1; }
</style>
```

- [ ] **Step 4：index.vue 接入右列**

- `import RightColumn from './modules/RightColumn'`，`components` 注册
- 模板 `<div class="col col-right">右列占位</div>` 替换为 `<right-column class="col col-right" />`

- [ ] **Step 5：lint + 人工验证**

```bash
cd ant-design-vue-jeecg && npm run lint && npm run serve
```
右列自上而下 4 个面板：任务能力指标（5 项）、处置措施进展（4 数 + B23 条目）、AI 态势解读（态势判断/关联推断两段）、预测潜在风险（2 条带置信度）。与设计图一致。确认后停止。

- [ ] **Step 6：提交**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add ant-design-vue-jeecg/src/views/situation/components/DisposalProgress.vue ant-design-vue-jeecg/src/views/situation/components/NarrativeBox.vue ant-design-vue-jeecg/src/views/situation/modules/RightColumn.vue ant-design-vue-jeecg/src/views/situation/index.vue
git commit -m "feat(situation): 右列 任务能力/处置进展/AI叙事/预测风险"
```

---

## Task 11：整体联调、构建验证与收尾

**Files:**
- 可能微调：`ant-design-vue-jeecg/src/views/situation/**/*.less`（像素对齐）
- 可能微调：`ant-design-vue-jeecg/src/views/situation/index.vue`（三列宽度/间距）

- [ ] **Step 1：全量 lint**

```bash
cd ant-design-vue-jeecg && npm run lint
```
Expected：0 error。

- [ ] **Step 2：生产构建**

```bash
npm run build
```
Expected：`Build complete`，无报错；`dist/` 生成。

- [ ] **Step 3：人工目检对照设计图（spec §7 验收）**

`npm run serve`，浏览器窗口拉到 1920×1080（或全屏），对照 `设计图首页.png` 逐项核对：
- 顶部标题、7 导航 Tab、两筛选、红色预警按钮、KPI 4 项、安全口径 4 项、时钟。
- 左列：5 项质量安全指标 + 2 条风险。
- 中列：中国地图 + 3 散点 + 连线 + 7 子 Tab + 右下小图。
- 右列：5 项任务能力 + 处置 4 数/B23 条目 + 叙事 2 段 + 预测 2 条。
- 配色（深蓝底/面板/红黄蓝）、字体（数字为科技体）。
- 控制台无报错。
- 改窗口尺寸：等比缩放、不变形、无滚动条。
- 点击指标/风险：跳转到 `/sys/...`（Phase1 可为空壳，不报错）；点非"总体态势"Tab 弹"建设中"。

记录与设计图不符的像素差异，在对应 `.less` / 模板中微调，重跑 `npm run lint`。

- [ ] **Step 4：提交收尾**

```bash
cd "e:/claude code projects/quality-safety-situation"
git add -A
git commit -m "style(situation): 像素对齐与收尾，Phase1 首页大屏复刻完成"
```

---

## 完成定义（Definition of Done）

- [ ] `/situation` 全屏大屏在 1920×1080 下与 `设计图首页.png` 视觉一致。
- [ ] 所有面板由 Mock 数据驱动；`api/situationApi.js` 每个函数注释标明对应真实接口。
- [ ] `npm run lint` 与 `npm run build` 均通过；`npm run serve` 控制台无报错。
- [ ] 多分辨率等比缩放正常。
- [ ] 顶栏时钟走时；导航/子 Tab 可切换；下钻可跳转。
- [ ] 11 个 Task 的 commit 全部落地。

## 后续（Phase 2+，不在本计划内）
真实后端接口与 DB 模型（替换 `situationApi.js` 内 mock）；其余导航页内容；后台各管理模块 CRUD；真实 AI 叙事与预测模型。
