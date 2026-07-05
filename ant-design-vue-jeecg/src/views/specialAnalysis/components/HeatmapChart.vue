<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaHeatmapChart',
  components: { BaseChart },
  props: {
    xLabels: { type: Array, required: true },
    yLabels: { type: Array, required: true },
    points: { type: Array, required: true },
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
