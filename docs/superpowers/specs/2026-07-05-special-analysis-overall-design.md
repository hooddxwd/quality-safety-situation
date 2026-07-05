# 专项分析·总体态势 大屏 — 设计文档

- **日期**: 2026-07-05
- **状态**: 已通过（设计评审），待写实现计划
- **范围**: 新建一个单页大屏「专项分析·总体态势」，从首页态势页「专题分析」入口整页跳转进入

## 1. 目标

在现有首页态势大屏 (`views/situation/`) 之外，新增一个并列的专项分析大屏页面。首期只实现 5 个子专题中的「总体态势」一页，按设计图 1:1 还原；其余 4 个子专题点击时提示「建设中」。

技术框架严格对齐现有 situation 页：Vue2 + ant-design-vue + ECharts + Less + 设计稿等比缩放方案。

## 2. 已确认的关键决策

| 决策点 | 选择 | 说明 |
|---|---|---|
| 跳转方式 | **应用内新路由整页跳转** | 新增 `/special-analysis` 路由，SPA 内 `$router.push` |
| 布局实现 | **背景图打底 + 绝对定位叠层** | bg 烘焙了完整设计（边框/标题/数字/图表/结论），overlay 仅覆盖动态内容 |
| 实现范围 | **仅「总体态势」**，其余子 tab 显示「建设中」 | 5 个子专题只做 1 个 |
| 数据来源 | **Phase1 mock**（与 situation 页一致） | Phase2 后端就绪时只换 api 层 |

## 3. 架构

### 3.1 路由

`ant-design-vue-jeecg/src/config/router.config.js` 的 `constantRouterMap` 新增（紧跟 `/situation`）：

```js
{
  path: '/special-analysis',
  name: 'special-analysis',
  component: () => import('@/views/specialAnalysis/index'),
  meta: { title: '专项分析·总体态势' }
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

`'专题分析'` 已在 `mock/header.js` 的 `navTabs` 中。

### 3.3 目录结构（镜像 situation 页，自包含）

```
ant-design-vue-jeecg/src/views/specialAnalysis/
├── index.vue                 # 页面壳：bj 背景 + 1920×1080 stage + overlay 槽位
├── useScale.js               # 16:9 单屏缩放（min 比例 + 居中，无滚动）
├── situation-style.less      # 本页全局类（.sa-screen / .num-tech），不依赖 situation.less
├── assets/
│   └── bj.png                # 复制自 切图/专项分析切图/总体态势/专项分析-总体态势bj.png
├── theme/
│   ├── variables.less        # 复制自 situation（设计 token，同源）
│   └── echarts-theme.json    # 复制自 situation（ECharts 主题，同源）
├── components/
│   ├── BaseChart.vue         # 复制自 situation（ECharts 封装 + 主题注册）
│   ├── BackButton.vue        # 左上角返回按钮 → /situation
│   ├── KpiNumber.vue         # KPI 大数字（含分级多值与百分比两种形态）
│   ├── DonutChart.vue        # 通用环形图（传入 title/series/legend）
│   ├── TrendChart.vue        # 同比趋势：分组柱+折线双轴
│   ├── StackedBarChart.vue   # 堆叠柱（主责单位分布）
│   └── ConclusionBox.vue     # 总体态势结论三段文本
├── mock/                     # 8 个面板各一个 mock 文件
│   ├── kpi.js  userDist.js  trend.js  reasonCat.js
│   ├── modelDist.js  unitDist.js  systemShare.js  conclusion.js
└── api/
    └── specialApi.js         # Phase1: Promise.resolve(mock); Phase2: 换 axios
```

**复用策略**：`BaseChart.vue` / `variables.less` / `echarts-theme.json` 从 situation 复制（而非跨目录 import），保证模块自包含、零耦合。设计 token 与 situation 同源，视觉风格一致。

## 4. 缩放方案（与 situation 不同）

situation 页是 1920×2160 长页面、按宽度缩放、允许垂直滚动。本页是 **1920×1080 单屏 16:9**，必须整屏可见不滚动：

```js
// useScale.js
const DESIGN_W = 1920, DESIGN_H = 1080
computeScale () {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  // 用 JS 算出居中 left/top，避免 CSS translate% 与 transform-origin 的歧义
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

非 16:9 屏幕留黑边（`fixed` + 居中），保证整屏不被裁剪。

## 5. 布局：背景图打底 + 绝对定位叠层

### 5.1 背景图

`assets/bj.png`（1920×1080）作为 stage 背景，`background: url(...) center/100% 100% no-repeat`。该图烘焙了完整设计（边框、面板标题、示例数字、图表图像、结论文字、FineVis 水印）。

### 5.2 叠层原则

- 每个 overlay 用 `position: absolute; left/top/width/height`（设计 px 坐标）对齐到 bg 烘焙的对应槽位内部（标题下方的内容区）。
- 每个 overlay 带**不透明背景**（取 bg 槽位底色，如 `#0a1e3c`），完全盖住下方烘焙的示例内容，避免重影。
- 标题文字由 bg 提供，代码不重绘。
- overlay 的精确 px 坐标在实现阶段按 bg 实测调参（浏览器内迭代），本 spec 只定结构与内容。

### 5.3 槽位清单（13 个 overlay + 返回按钮）

| 区域 | overlay | 内容 | 渲染方式 |
|---|---|---|---|
| 顶部左上 | BackButton | 返回 `/situation` | a-button 胶囊 |
| KPI-1 | KpiNumber | 质量问题总数 **286** | a-statistic |
| KPI-2 | KpiNumber | 自用产品问题数 **126** | a-statistic |
| KPI-3 | KpiNumber | 出口产品问题数 **82** | a-statistic |
| KPI-4 | KpiNumber | 民用产品问题数 **78** | a-statistic |
| KPI-5 | KpiNumber | 分级问题统计 **6 / 42 / 238**（重大/严重/一般） | 三段数字 |
| KPI-6 | KpiNumber | 问题闭环率 **91.60%** | a-statistic |
| 中-左 | DonutChart | 用户分布：部队用户 / 出口用户 / 民航用户 / 试验用户 / 维修保障单位 | 环形图 |
| 中-中 | TrendChart | 同比趋势对比：重大(柱) / 严重(柱) / 万时率(线)，双 yAxis | 分组柱+折线 |
| 中-右 | DonutChart | 原因大类占比：设计 / 制造 / 装配 / 器材 / 使用维护 / 管理 / 待查 | 环形图 |
| 下-1 | DonutChart | 自用产品型号分布：A-31 / A-29 / B-17 / C-18 / D-12 / 保障装备 | 环形图 |
| 下-2 | StackedBarChart | 问题主责单位分布：重大 / 严重 / 一般 | 堆叠柱 |
| 下-3 | DonutChart | 所属系统占比：飞控 / 动力 / 航电 / 液压 / 结构 / 保障设备 | 环形图 |
| 下-4 | ConclusionBox | 总体态势结论三段：上半年质量总体评价 / 核心运行特征 / 主要矛盾与风险点 | 文本块 |

### 5.4 FineVis 水印

bg 底部含 FineVis 水印「您使用了未注册的功能——FineVis可视化看板」。用一个深色小 overlay（与 bg 底部同色）盖掉。

## 6. 图表细节（ECharts）

复用 `BaseChart.vue`（已含 `situation` 主题注册、ResizeObserver 容错初始化）。

- **DonutChart×4**：`series.type=pie`，`radius:['45%','70%']`，`label` 显示百分比，右侧或下方 legend；色板取 echarts-theme。
- **TrendChart**：两个 `xAxis` 类目（如月份/机型），`yAxis×2`（左=数量、右=万时率）；`series` 重大/严重为柱（`type=bar`），万时率为折线（`type=line`，`yAxisIndex=1`）。
- **StackedBarChart**：`series.stack='unit'`，重大/严重/一般三段，竖向柱。
- **KpiNumber**：纯样式数字，无图表。分级统计卡用三段并排数字。

所有 chart option 由 mock 数据驱动，组件接收数据 prop、内部组装 option。

## 7. 数据层（Phase1 mock）

- `mock/*.js` 每个导出一个对象/数组，样例数值对齐设计图（286/126/82/78/6·42·238/91.60% 等）。
- `api/specialApi.js` 对每个面板一个 `getXxx()` 函数，`return Promise.resolve(xxxMock)`，并预留 Phase2 注释（对应后端接口路径，如 `GET /special-analysis/kpi`）。
- `index.vue` 的 `mounted` 用 `Promise.all` 并发拉取，赋值给 data，与 situation 页同模式。

## 8. 不做（YAGNI / 超范围）

- 其余 4 个子专题页（专项分析 / 工作计划 / 案例分析 / 规律总结）的内容实现。
- 子专题之间的切换导航栏（设计图无此元素）。
- 真实后端接口对接。
- FineVis 式交互联动（设计图为静态）。

## 9. 后续工作（参考资料）

其余 4 个子专题的背景图已就位，将来实现时直接取用：

| 子专题 | 背景图路径 |
|---|---|
| 专项分析 | `切图/专项分析切图/专项分析/专项分析-专项分析bj.png` |
| 工作计划 | `切图/专项分析切图/工作计划/专项分析-工作计划bj.png` |
| 案例分析 | `切图/专项分析切图/案例分析/专项分析-案例分析bj.png` |
| 规律总结 | `切图/专项分析切图/规律总结/专项分析-规律总结bj.png` |

实现这些子专题时，可复用本页的 `BaseChart` / `theme` / `useScale`，届时考虑抽到公共目录。

## 10. 实现阶段待定项（非阻塞）

- 13 个 overlay 的精确 px 坐标：实现时按 bg 实测，浏览器内迭代对齐。
- 各环形图的色板顺序、legend 排版：按设计图视觉调。
- 返回按钮的最终位置/样式：左上角胶囊，若与烘焙标题冲突则微调。
