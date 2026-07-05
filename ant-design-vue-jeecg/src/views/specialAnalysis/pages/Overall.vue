<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div v-for="(c, i) in data.kpi" :key="'k' + i" class="sa-slot kpi-slot"
         :style="slotStyle(kpiPos(i))">
      <kpi-number :item="c" />
    </div>

    <div class="sa-slot" :style="slotStyle({ left: '2%', top: '30%', w: '23%', h: '27%' })"><donut-chart :data="data.userDist" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '27%', top: '30%', w: '46%', h: '27%' })"><trend-chart :categories="data.trend.categories" :bars="data.trend.bars" :line="data.trend.line" /></div>
    <div class="sa-slot" :style="slotStyle({ left: '75%', top: '30%', w: '23%', h: '27%' })"><donut-chart :data="data.reasonCat" /></div>

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
      const left = 2 + i * (96 / 6)
      return { left: left + '%', top: '14%', w: (96 / 6 - 1.2) + '%', h: '12%' }
    },
    slotStyle (p) {
      return { left: p.left, top: p.top, width: p.w, height: p.h }
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
