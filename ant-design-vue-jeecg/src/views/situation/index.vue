<template>
  <div class="situation-screen">
    <div class="situation-stage" :style="scaleStyle">
      <!-- 顶部导航 -->
      <situation-header :data="header" :active-tab="activeTab" @nav="onNav" @alert="onAlert" />

      <!-- 第一行：7 个 KPI 卡片 -->
      <div class="kpi-row">
        <div v-for="(c, i) in kpiCards" :key="i" class="kpi-card">
          <div class="kpi-card__label">{{ c.label }}</div>
          <div v-if="!c.sub" class="kpi-card__value num-tech" :class="'tone-' + c.tone">{{ c.value }}<small>{{ c.unit }}</small></div>
          <div v-else class="kpi-card__sub">
            <div v-for="(s, j) in c.sub" :key="j" class="kpi-sub-item">
              <span class="kpi-sub-label">{{ s.label }}</span>
              <span class="kpi-sub-value num-tech" :class="'tone-' + s.tone">{{ s.value }}<small>{{ s.unit }}</small></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行：质量安全指标(25%) ｜ 分布态势地图(50%) ｜ 任务能力指标(25%) -->
      <div class="row-main">
        <tech-panel title="质量安全评价指标" tab="态势分析">
          <metric-bar v-for="m in quality" :key="m.id" :item="m" :level="m.level" />
        </tech-panel>
        <center-map />
        <tech-panel title="任务能力评价指标" tab="态势分析">
          <metric-bar v-for="m in task" :key="m.id" :item="m" :level="m.level" />
        </tech-panel>
      </div>

      <!-- 第三行：4 等分 已识别风险 ｜ 处置进展 ｜ AI叙事 ｜ 预测风险 -->
      <div class="row-bottom">
        <tech-panel title="已识别风险清单" tab="风险识别">
          <risk-list-item v-for="r in risks" :key="r.id" :item="r" />
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
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import useScale from './useScale'
import SituationHeader from './components/SituationHeader'
import TechPanel from './components/TechPanel'
import MetricBar from './components/MetricBar'
import RiskListItem from './components/RiskListItem'
import DisposalProgress from './components/DisposalProgress'
import NarrativeBox from './components/NarrativeBox'
import CenterMap from './components/CenterMap'
import {
  getSituationHeader, getQualityIndicators, getRiskList,
  getTaskIndicators, getDisposal, getNarrative, getPrediction
} from './api/situationApi'

export default {
  name: 'SituationIndex',
  components: { SituationHeader, TechPanel, MetricBar, RiskListItem, DisposalProgress, NarrativeBox, CenterMap },
  mixins: [useScale],
  data () {
    return {
      header: { title: '', navTabs: [], filters: {}, kpi: [], safety: [], alertBtn: '' },
      quality: [], task: [], risks: [],
      disposal: { summary: [], item: {} }, narrative: [], prediction: [],
      activeTab: '总体态势'
    }
  },
  computed: {
    // 7 张卡片：4 个 kpi + 安全口径(事故数/事故征候双值) + 质量问题数 + 满意度
    kpiCards () {
      const k = this.header.kpi || []
      const s = this.header.safety || []
      const toneBy = (label) => (/事故|征候/.test(label) ? 'red' : (/在修|质量/.test(label) ? 'yellow' : 'blue'))
      const cards = []
      k.forEach(it => cards.push({ label: it.label, value: it.value, unit: it.unit, tone: toneBy(it.label) }))
      const acc = s.filter(it => /事故|征候/.test(it.label))
      if (acc.length) {
        cards.push({ label: '安全口径·事故/事故征候', sub: acc.map(it => ({ label: it.label, value: it.value, unit: it.unit, tone: 'red' })) })
      }
      s.filter(it => !/事故|征候/.test(it.label)).forEach(it => cards.push({ label: it.label, value: it.value, unit: it.unit, tone: toneBy(it.label) }))
      return cards
    }
  },
  async mounted () {
    const [h, q, r, t, d, n, p] = await Promise.all([
      getSituationHeader(), getQualityIndicators(), getRiskList(),
      getTaskIndicators(), getDisposal(), getNarrative(), getPrediction()
    ])
    this.header = h; this.quality = q; this.risks = r; this.task = t
    this.disposal = d; this.narrative = n; this.prediction = p
  },
  methods: {
    onNav (t) { this.activeTab = t; if (t !== '总体态势') message.info(`「${t}」建设中`) },
    onAlert () { message.warning('总体态势预警（Phase1 交互壳）') }
  }
}
</script>

<!-- 全局：共享大屏类（.situation-screen / .tech-panel / .num-tech）供所有子组件使用 -->
<style lang="less">
@import './situation.less';
</style>

<!-- 本页布局（scoped） -->
<style lang="less" scoped>
@import './theme/variables.less';

.situation-stage {
  box-sizing: border-box; display: flex; flex-direction: column;
  gap: 12px; padding: 10px 16px 14px;
}

/* 第一行：7 KPI 卡片 */
.kpi-row { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 12px; flex: 0 0 auto; }
.kpi-card {
  background: @sit-panel-bg; border: 1px solid @sit-panel-border; border-radius: 4px;
  padding: 10px 14px; display: flex; flex-direction: column; justify-content: center;
  box-shadow: 0 0 12px -4px @sit-card-glow, inset 0 0 16px -8px rgba(24, 144, 255, 0.2);
}
.kpi-card__label { color: @sit-text-dim; font-size: 12px; }
.kpi-card__value { font-size: 28px; line-height: 1.1; margin-top: 4px; }
.kpi-card__value small { font-size: 12px; color: @sit-text-dim; margin-left: 3px; font-weight: 400; }
.kpi-card__sub { display: flex; gap: 16px; margin-top: 4px; }
.kpi-sub-item { display: flex; flex-direction: column; }
.kpi-sub-label { color: @sit-text-dim; font-size: 11px; }
.kpi-sub-value { font-size: 20px; line-height: 1.1; }

.tone-blue { color: @sit-blue; text-shadow: 0 0 8px rgba(24, 144, 255, 0.5); }
.tone-yellow { color: @sit-yellow; text-shadow: 0 0 8px rgba(255, 193, 7, 0.5); }
.tone-red { color: @sit-red; text-shadow: 0 0 8px rgba(255, 77, 79, 0.5); }
.tone-green { color: @sit-green; text-shadow: 0 0 8px rgba(0, 196, 140, 0.5); }

/* 第二行：25% / 50% / 25% */
.row-main { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 12px; flex: 1.4 1 0; min-height: 0; }
.row-main > * { min-height: 0; height: 100%; }

/* 第三行：4 等分 */
.row-bottom { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; flex: 1 1 0; min-height: 0; }
.row-bottom > * { min-height: 0; height: 100%; }
</style>
