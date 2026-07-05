<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div v-for="(c, i) in data.kpi" :key="'k'+i" class="sa-slot"
         :style="{ left: (2 + i*24) + '%', top: '14%', width: '22%', height: '12%' }">
      <kpi-number :item="c" />
    </div>
    <div class="sa-slot" :style="{ left:'2%', top:'30%', width:'23%', height:'27%' }">
      <stacked-bar-chart :categories="data.typeDist.categories" :series="data.typeDist.series" />
    </div>
    <div class="sa-slot" :style="{ left:'26%', top:'30%', width:'23%', height:'27%' }">
      <donut-chart :data="data.stageDist" />
    </div>
    <div class="sa-slot" :style="{ left:'50%', top:'30%', width:'23%', height:'27%' }">
      <bar-chart :categories="data.systemRank.categories" :values="data.systemRank.values" />
    </div>
    <div class="sa-slot" :style="{ left:'74%', top:'30%', width:'24%', height:'27%' }">
      <bar-chart :categories="data.cycle.categories" :values="data.cycle.values" :threshold="data.cycle.threshold" />
    </div>
    <div class="sa-slot" :style="{ left:'2%', top:'60%', width:'96%', height:'36%' }">
      <data-table :columns="data.table.columns" :rows="data.table.rows" :table-height="300" />
    </div>
  </div>
</template>

<script>
import bg from '../assets/bg-workplan.png'
import { getWorkPlanData } from '../api/specialApi'
import KpiNumber from '../components/KpiNumber.vue'
import DonutChart from '../components/DonutChart.vue'
import BarChart from '../components/BarChart.vue'
import StackedBarChart from '../components/StackedBarChart.vue'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'SaWorkPlan',
  components: { KpiNumber, DonutChart, BarChart, StackedBarChart, DataTable },
  data () {
    return { bg, data: { kpi: [], typeDist: {}, stageDist: [], systemRank: {}, cycle: {}, table: { columns: [], rows: [] } } }
  },
  async mounted () { this.data = await getWorkPlanData() }
}
</script>
