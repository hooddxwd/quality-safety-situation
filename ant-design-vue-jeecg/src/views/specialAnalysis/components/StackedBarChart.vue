<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaStackedBarChart',
  components: { BaseChart },
  props: {
    categories: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
    gantt: { type: Boolean, default: false },
    ganttRows: { type: Array, default: () => [] },
    monthCount: { type: Number, default: 11 }
  },
  computed: {
    option () {
      return this.gantt ? this.ganttOption : this.stackedOption
    },
    stackedOption () {
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { textStyle: { color: '#fff' }, top: 0 },
        grid: { left: '8%', right: '6%', top: '18%', bottom: '12%' },
        xAxis: { type: 'category', data: this.categories,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        yAxis: { type: 'value',
          axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
        series: this.series.map(s => ({ ...s, type: 'bar', stack: 'total', barMaxWidth: 30 }))
      }
    },
    ganttOption () {
      const rowNames = this.ganttRows.map(r => r.name)
      const palette = ['#1890ff', '#00c48c', '#ffc107', '#ff4d4f', '#a070ff']
      const baseData = this.ganttRows.map(r => r.segments[0] ? r.segments[0].start : 0)
      const segData = this.ganttRows.map(r => {
        const s = r.segments[0] || { start: 0, end: 0 }
        return s.end - s.start
      })
      const colors = this.ganttRows.map((r, i) => r.color || palette[i % palette.length])
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { show: false },
        grid: { left: '14%', right: '6%', top: '8%', bottom: '12%' },
        xAxis: { type: 'value', max: this.monthCount,
          axisLabel: { color: '#fff', formatter: v => 'M' + v }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.1)' } } },
        yAxis: { type: 'category', data: rowNames, inverse: true,
          axisLabel: { color: '#fff' }, axisLine: { lineStyle: { color: 'rgba(255,255,255,.3)' } } },
        series: [
          { name: 'base', type: 'bar', stack: 'gantt', itemStyle: { color: 'transparent' }, data: baseData },
          { name: 'dur', type: 'bar', stack: 'gantt',
            data: segData.map((v, i) => ({ value: v, itemStyle: { color: colors[i] } })),
            label: { show: true, formatter: '治理中', color: '#fff', fontSize: 11 } }
        ]
      }
    }
  }
}
</script>
