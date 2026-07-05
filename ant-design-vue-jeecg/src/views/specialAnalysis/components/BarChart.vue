<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaBarChart',
  components: { BaseChart },
  props: {
    categories: { type: Array, required: true },
    values: { type: Array, required: true },
    threshold: { type: Number, default: null }
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
