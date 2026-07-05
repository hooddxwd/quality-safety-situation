<template>
  <base-chart v-if="option" :option="option" />
</template>

<script>
import BaseChart from './BaseChart.vue'
export default {
  name: 'SaDonutChart',
  components: { BaseChart },
  props: {
    data: { type: Array, required: true }
  },
  computed: {
    option () {
      return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: {
          type: 'scroll', orient: 'vertical', right: '3%', top: 'center',
          textStyle: { color: '#fff', fontSize: 13 },
          pageTextStyle: { color: '#fff' }
        },
        series: [{
          name: '占比', type: 'pie',
          radius: ['42%', '68%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderColor: '#061a33', borderWidth: 2 },
          label: { show: true, formatter: '{d}%', color: '#fff', fontSize: 12 },
          labelLine: { length: 8, length2: 8 },
          data: this.data
        }]
      }
    }
  }
}
</script>
