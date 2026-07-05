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
  async mounted () {
    try { this.data = await getPatternData() }
    catch (e) { console.error('[sa-pattern] load failed', e) }
  }
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
