<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaTrendChart',
  components: { BaseChart },
  props: {
    categories: { type: Array, default: () => [] },
    bars: { type: Array, default: () => [] },
    line: { type: Object, default: null }
  },
  computed: {
    option () {
      const series = this.bars.map(b => ({
        name: b.name, type: 'bar', data: b.data, stack: 'trend', barMaxWidth: 24,
        itemStyle: { color: b.color || '#1890ff' }
      }))
      if (this.line) {
        series.push({
          name: this.line.name, type: 'line', data: this.line.data, yAxisIndex: 1,
          smooth: true, symbolSize: 8,
          lineStyle: { color: this.line.color || '#ffc107', width: 3 },
          itemStyle: { color: this.line.color || '#ffc107' }
        })
      }
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { textStyle: { color: '#fff' }, top: 0 },
        grid: { left: '8%', right: '9%', top: '18%', bottom: '12%' },
        xAxis: { type: 'category', data: this.categories,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        yAxis: [
          { type: 'value', name: '数量', nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
          { type: 'value', name: '万时率', nameTextStyle: { color: '#fff' },
            axisLabel: { color: '#fff' }, splitLine: { show: false } }
        ],
        series
      }
    }
  }
}
</script>
