<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="sa-slot" :style="{ left:'2%', top:'18%', width:'40%', height:'40%' }">
      <stacked-bar-chart gantt :gantt-rows="data.gantt.rows" :month-count="data.gantt.monthCount" />
    </div>
    <div class="sa-slot" :style="{ left:'43%', top:'18%', width:'27%', height:'40%' }">
      <numbered-list :items="data.capability" />
    </div>
    <div class="sa-slot" :style="{ left:'71%', top:'18%', width:'27%', height:'40%' }">
      <numbered-list :items="data.safeguard" />
    </div>
    <div v-for="(g,i) in data.goals" :key="i" class="sa-slot"
         :style="{ left: (2 + i*24) + '%', top:'62%', width:'22%', height:'28%' }">
      <gauge-bar :item="g" />
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-special.png'
import { getSpecialData } from '../api/specialApi'
import StackedBarChart from '../components/StackedBarChart.vue'
import NumberedList from '../components/NumberedList.vue'
import GaugeBar from '../components/GaugeBar.vue'

export default {
  name: 'SaSpecial',
  components: { StackedBarChart, NumberedList, GaugeBar },
  data () {
    return { bg, data: { gantt: { rows: [], monthCount: 11 }, capability: [], safeguard: [], goals: [] } }
  },
  async mounted () { this.data = await getSpecialData() }
}
</script>
