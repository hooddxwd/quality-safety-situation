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
