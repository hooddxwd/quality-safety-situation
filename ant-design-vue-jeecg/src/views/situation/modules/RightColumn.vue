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
