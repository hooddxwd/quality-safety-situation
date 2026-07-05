# 专项分析大屏（5 子页） — 设计文档

- **日期**: 2026-07-05
- **状态**: 已通过（设计评审，含范围扩展），待写实现计划
- **范围**: 新建「专项分析」大屏模块，含 5 个子页面（专项分析 / 工作计划 / 总体态势 / 案例分析 / 规律总结），从首页态势页「专题分析」入口整页跳转进入

## 1. 目标

在现有首页态势大屏 (`views/situation/`) 之外，新增一个并列的「专项分析」大屏模块，包含 5 个子页面，按各自设计图 1:1 还原。所有页面 16:9 单屏，顶部导航与首页态势一致，数据先写死前端（Phase1 mock），后续接后端从数据库取。

技术框架严格对齐现有 situation 页：Vue2 + ant-design-vue + ECharts + Less + 设计稿等比缩放方案。

## 2. 已确认的关键决策

| 决策点 | 选择 | 说明 |
|---|---|---|
| 跳转方式 | 应用内新路由整页跳转 | 新增 `/special-analysis` 路由族，SPA 内 `$router` 切换 |
| 顶部导航 | **复用 SituationHeader + 子 tab 行** | 顶导与 situation 完全一致（7 个 navTabs，「专题分析」高亮）；其下一行 5 子 tab 切换子页 |
| 内容落地 | **bg 打底 + 绝对定位叠层（逐页调坐标）** | 每页 bg（1920×1080，自带烘焙设计）打底，overlay 盖动态内容；代码 header 叠在 bg 烘焙标题上方，内容坐标逐页测量调参 |
| 页面比例 | 全部 16:9 单屏 | 1920×1080，min 比例缩放居中，无滚动 |
| 数据来源 | **Phase1 写死前端（mock）**，后续接后端 DB | api 层包 `Promise.resolve(mock)`，Phase2 换 axios，组件不改 |
| 实现范围 | **5 个子页全部实现** | 专项分析 / 工作计划 / 总体态势 / 案例分析 / 规律总结 |

## 3. 架构

### 3.1 路由（嵌套）

`ant-design-vue-jeecg/src/config/router.config.js` 的 `constantRouterMap` 新增（紧跟 `/situation`）：

```js
{
  path: '/special-analysis',
  component: () => import('@/views/specialAnalysis/Layout'),
  redirect: '/special-analysis/overall',
  children: [
    { path: 'overall',   name: 'sa-overall',   component: () => import('@/views/specialAnalysis/pages/Overall'),   meta: { title: '专项分析·总体态势', tab: 'overall' } },
    { path: 'special',   name: 'sa-special',   component: () => import('@/views/specialAnalysis/pages/Special'),   meta: { title: '专项分析·专项分析', tab: 'special' } },
    { path: 'workplan',  name: 'sa-workplan',  component: () => import('@/views/specialAnalysis/pages/WorkPlan'),  meta: { title: '专项分析·工作计划', tab: 'workplan' } },
    { path: 'case',      name: 'sa-case',      component: () => import('@/views/specialAnalysis/pages/CaseAnalysis'), meta: { title: '专项分析·案例分析', tab: 'case' } },
    { path: 'pattern',   name: 'sa-pattern',   component: () => import('@/views/specialAnalysis/pages/PatternSummary'), meta: { title: '专项分析·规律总结', tab: 'pattern' } }
  ]
}
```

### 3.2 跳转入口

`views/situation/index.vue` 的 `onNav` 改为：

```js
onNav (t) {
  this.activeTab = t
  if (t === '专题分析') return this.$router.push('/special-analysis')
  if (t !== '总体态势') message.info(`「${t}」建设中`)
}
```

### 3.3 目录结构（镜像 situation，模块自包含）

```
ant-design-vue-jeecg/src/views/specialAnalysis/
├── Layout.vue                # 1920×1080 缩放 stage + SituationHeader + 子tab行 + <router-view>
├── useScale.js               # 16:9 单屏缩放（min 比例 + 居中，无滚动）
├── SubTabs.vue               # 5 子 tab 行组件
├── specialAnalysis.less      # 全局类（.sa-screen / .num-tech），不依赖 situation.less
├── assets/
│   ├── bg-overall.png        # 复制 切图/专项分析切图/总体态势/专项分析-总体态势bj.png
│   ├── bg-special.png        # 复制 切图/专项分析切图/专项分析/专项分析-专项分析bj.png
│   ├── bg-workplan.png       # 复制 切图/专项分析切图/工作计划/专项分析-工作计划bj.png
│   ├── bg-case.png           # 复制 切图/专项分析切图/案例分析/专项分析-案例分析bj.png
│   ├── bg-pattern.png        # 复制 切图/专项分析切图/规律总结/专项分析-规律总结bj.png
│   └── tabs/                 # 复制 切图/专项分析切图/工作计划/{专项分析,工作计划,总体态势,案例分析,规律总结}.png 作子tab底图
├── theme/
│   ├── variables.less        # 复制自 situation（同源设计 token）
│   └── echarts-theme.json    # 复制自 situation（ECharts 主题）
├── components/               # 通用图表/展示组件，参数化复用
│   ├── BaseChart.vue         # 复制自 situation
│   ├── KpiNumber.vue         # 大数字（含分级多值/百分比形态）
│   ├── DonutChart.vue        # 环形图（title/series/legend）
│   ├── BarChart.vue          # 柱图（含可选阈值线、渐变色）
│   ├── StackedBarChart.vue   # 堆叠柱 / 横向甘特
│   ├── TrendChart.vue        # 分组柱 + 折线双轴
│   ├── GaugeBar.vue          # 进度条仪表
│   ├── HeatmapChart.vue      # 热力图
│   ├── DataTable.vue         # 科技风表格（深底/蓝表头/斑马纹）
│   └── NumberedList.vue      # 编号文本列表
├── pages/
│   ├── Overall.vue           # 总体态势
│   ├── Special.vue           # 专项分析
│   ├── WorkPlan.vue          # 工作计划
│   ├── CaseAnalysis.vue      # 案例分析
│   └── PatternSummary.vue    # 规律总结
├── mock/                     # 每页一个 mock 文件
│   ├── overall.js  special.js  workplan.js  caseAnalysis.js  patternSummary.js
└── api/
    └── specialApi.js         # Phase1: Promise.resolve(mock); Phase2: 换 axios
```

**复用 vs 复制策略**：
- **import 复用**（单一数据源，保证与 situation 完全一致）：`SituationHeader` 及其 header mock（navTabs/filters/alertBtn）从 `views/situation/` 跨目录 import。
- **复制**（图表基础设施，模块自包含）：`BaseChart.vue` / `variables.less` / `echarts-theme.json` 复制进本模块。
- 本模块自有的 `components/`（Donut/Bar/Stacked/Trend/Gauge/Heatmap/Table/NumberedList）全部参数化，5 个页面共用。

## 4. 顶部导航与子页切换

### 4.1 SituationHeader（顶导，与 situation 一致）

`Layout.vue` 复用 `views/situation/components/SituationHeader.vue`，传入与 situation 同源的 header mock（navTabs / filters / alertBtn / clock）。「专题分析」置为 active。`@nav` 由 Layout 处理：

```js
onHeaderNav (t) {
  if (t === '总体态势') return this.$router.push('/situation')
  if (t === '专题分析') return           // 已在本模块，停留
  message.info(`「${t}」建设中`)
}
```

### 4.2 SubTabs（5 子 tab 行）

`SubTabs.vue` 渲染在 SituationHeader 下方一行：专项分析 / 工作计划 / 总体态势 / 案例分析 / 规律总结。当前路由的 `meta.tab` 决定高亮项；点击 → `$router.push('/special-analysis/' + key)`。tab 底图用 `assets/tabs/*.png`（取自切图）。

> 命名注意：navTab「总体态势」= 首页态势（→ /situation）；子 tab「总体态势」= 本模块总体态势子页。两者在不同行，靠位置区分。

### 4.3 几何关系（叠层 vs 代码 header）

- Layout 持有一个 1920×1080 的缩放 stage（见 §5）。stage 内三层绝对定位：
  1. **页面层**（`<router-view>`，z 低）：当前页的 bg（1920×1080 全幅）+ 内容 overlay。
  2. **代码 header 层**（z 高）：SituationHeader + SubTabs，绝对定位在 stage 顶部，覆盖 bg 烘焙的标题头。
- 因 bg 自带烘焙标题（~90px）而代码 header 更高（~150px），代码 header 会盖住 bg 顶部一小段。各页内容 overlay 须定位到 header 下方的烘焙槽位；若某页顶排槽位与 header 重叠，按实测下移坐标（即「逐页调坐标」）。
- bg 底部 FineVis 水印用深色小 overlay 盖掉。

## 5. 缩放方案（16:9 单屏，与 situation 不同）

situation 是 1920×2160 长页面、按宽度缩放、可滚动。本模块全部 1920×1080 单屏，整屏可见不滚动：

```js
// useScale.js
const DESIGN_W = 1920, DESIGN_H = 1080
computeScale () {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  this.scaleStyle = {
    width: DESIGN_W + 'px', height: DESIGN_H + 'px',
    position: 'absolute',
    left: ((window.innerWidth - DESIGN_W * s) / 2) + 'px',
    top: ((window.innerHeight - DESIGN_H * s) / 2) + 'px',
    transformOrigin: '0 0',
    transform: `scale(${s})`
  }
  this.screenStyle = { position: 'fixed', inset: '0', overflow: 'hidden', background: '#061a33' }
}
```

非 16:9 屏幕留黑边（`fixed` + 居中）。

## 6. 五个子页内容清单

> 每页 = 该页 bg 打底 + 下表 overlay。overlay 精确 px 坐标实现时按 bg 实测调参。所有数字/文案先按设计图写死在 mock。

### 6.1 总体态势 (Overall) — bg: bg-overall.png

| 区域 | 组件 | 内容 |
|---|---|---|
| KPI×6 | KpiNumber | 质量问题总数 286 / 自用产品问题数 126 / 出口产品问题数 82 / 民用产品问题数 78 / 分级问题统计 6·42·238(重大·严重·一般) / 问题闭环率 91.60% |
| 中-左 | DonutChart | 用户分布：部队/出口/民航/试验/维修保障单位 |
| 中-中 | TrendChart | 同比趋势对比：重大(柱)+严重(柱)+万时率(线，双轴) |
| 中-右 | DonutChart | 原因大类占比：设计/制造/装配/器材/使用维护/管理/待查 |
| 下-1 | DonutChart | 自用产品型号分布：A-31/A-29/B-17/C-18/D-12/保障装备 |
| 下-2 | StackedBarChart | 问题主责单位分布：重大/严重/一般 |
| 下-3 | DonutChart | 所属系统占比：飞控/动力/航电/液压/结构/保障设备 |
| 下-4 | 文本块 | 总体态势结论：上半年质量总体评价 / 核心运行特征 / 主要矛盾与风险点 |

### 6.2 专项分析 (Special) — bg: bg-special.png

| 区域 | 组件 | 内容 |
|---|---|---|
| 上-左 | StackedBarChart(横向甘特) | 重点专项治理甘特图：x=月份(06~次年04)，y=高发系统整治/重复性问题清零/薄弱环节攻关/供应链提升 |
| 上-中 | NumberedList | 质量数据能力提升：①预警机制建设 ②指标体系搭建 ③可视化大屏应用 ④智能分析模型引入 |
| 上-右 | NumberedList | 保障措施矩阵：①组织保障 ②技术保障 ③制度保障 ④数据保障 |
| 下排×4 | GaugeBar | 质量稳定性提升 72% / 问题发生率下降 35% / 闭环效率提升 82% / 预警能力增强 67% |

### 6.3 工作计划 (WorkPlan) — bg: bg-workplan.png

| 区域 | 组件 | 内容 |
|---|---|---|
| KPI×4 | KpiNumber | 自用问题总数 126 / 已归零数 114 / 归零完成率 90.50% / 超期归零数 7 |
| 中-1 | StackedBarChart | 问题类型分布：设计/工艺/装配/试验/管理 × 重大/严重/一般 |
| 中-2 | DonutChart | 发生阶段分布：研制 22% / 生产 38% / 交付 17% / 使用维护 24% |
| 中-3 | BarChart | 系统问题排行：飞控/动力/航电/液压/结构 |
| 中-4 | BarChart(带阈值线) | 归零周期分析：设计/工艺/装配/试验/管理，超期阈值线 |
| 下 | DataTable | 未归零问题清单：问题编号/机型/问题描述/当前状态/剩余周期 |

### 6.4 案例分析 (CaseAnalysis) — bg: bg-case.png

| 区域 | 组件 | 内容 |
|---|---|---|
| 左 | DataTable | 典型案例列表：序号/发生时间/机型/地点/问题标题/等级(严重/重大/一般 色标) |
| 右 | 画板 + 5 步按钮 | 案例详情画板：选中案例展示详情；底部 5 按钮 现象/数据回放/原因定位/措施验证/标准固化（Phase1 按钮提示「建设中」或展示占位详情） |

### 6.5 规律总结 (PatternSummary) — bg: bg-pattern.png

| 区域 | 组件 | 内容 |
|---|---|---|
| 左 | HeatmapChart | 共性规律可视化：问题词 × 阶段 矩阵，蓝→黄色阶 |
| 中 | DonutChart | 深层原因多层占比：技术层/工艺层/管理层/供应链/标准规范 |
| 右 | 文本+KPI 列表 | 系统性问题归纳：设计裕度不够 31(10.8%) / 接口匹配不充分 27(9.4%) / 工艺一致性差 46(16.1%) / 测试覆盖不足 22(7.7%) |

## 7. 共享组件细节（ECharts）

复用 `BaseChart.vue`（已含 `situation` 主题注册、ResizeObserver 容错初始化）。所有 chart option 由 mock 数据驱动，组件收 data prop、内部组装 option。

- **DonutChart**：`pie` + `radius:['45%','70%']`，百分比 label，legend 视槽位在右或下。
- **BarChart**：`bar`，可选 `markLine`（阈值线，如归零周期「超期」），可选渐变色。
- **StackedBarChart**：`stack`，竖向（主责单位/问题类型）或横向（甘特，y 轴类目=治理项）。
- **TrendChart**：双 `yAxis`，重大/严重=柱，万时率=线（`yAxisIndex:1`）。
- **GaugeBar**：进度条（`bar` 横向或 `gauge`），显示百分比。
- **HeatmapChart**：`heatmap` + `visualMap` 蓝→黄。
- **DataTable**：基于 `a-table`，深底/蓝表头/斑马纹主题覆盖。
- **NumberedList**：编号 + 标题 + 描述的纯样式列表。

## 8. 数据层（Phase1 mock，写死前端）

- `mock/<page>.js` 各导出该页所需结构，样例数值对齐设计图。
- `api/specialApi.js` 每页一个 `getXxxPageData()`，`return Promise.resolve(mock)`，预留 Phase2 注释（接口如 `GET /special-analysis/overall`）。
- 各 page 组件 `mounted` 用 `Promise.all`（或单页单取）拉取赋值，与 situation 同模式。
- **后续接后端**：仅改 `api/specialApi.js` 函数体为 axios 请求，组件零改动。

## 9. 不做（YAGNI / 超范围）

- 案例分析「案例详情画板」的真实详情内容与 5 步按钮的真实切换交互（Phase1 仅壳）。
- FineVis 式交互联动、维度/联动筛选下拉（切图虽有但属后续增强）。
- 真实后端接口与数据库对接（Phase2）。

## 10. 实现阶段待定项（非阻塞）

- 各页 overlay 的精确 px 坐标：实现时按各自 bg 实测，浏览器内迭代对齐。
- 代码 header 与 bg 烘焙标题的重叠：逐页微调内容起始坐标。
- 子 tab 底图（`assets/tabs/*.png`）的高亮/常态态：按切图资源确认。
- 各环形图色板顺序、legend 排版：按设计图视觉调。

## 11. 后续工作

- Phase2：`api/specialApi.js` 改 axios，对接后端从数据库取数；组件不改。
- 案例分析详情画板与 5 步交互的完整实现。
- 维度筛选 / 联动筛选下拉（切图已有素材）。
