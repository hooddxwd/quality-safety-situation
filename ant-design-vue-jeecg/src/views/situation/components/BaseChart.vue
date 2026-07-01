<template>
  <div ref="el" class="base-chart"></div>
</template>

<script>
import * as echarts from 'echarts'
import theme from '../theme/echarts-theme.json'

let themeRegistered = false
function ensureTheme () {
  if (!themeRegistered) {
    echarts.registerTheme('situation', theme)
    themeRegistered = true
  }
}

export default {
  name: 'BaseChart',
  props: {
    option: { type: Object, required: true }
  },
  data () {
    return { chart: null }
  },
  watch: {
    option () { this.render() }
  },
  mounted () {
    ensureTheme()
    this.chart = echarts.init(this.$refs.el, 'situation')
    this.render()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    if (this.chart) { this.chart.dispose(); this.chart = null }
  },
  methods: {
    render () { if (this.chart) this.chart.setOption(this.option, true) },
    onResize () { if (this.chart) this.chart.resize() }
  }
}
</script>

<style scoped>
.base-chart { width: 100%; height: 100%; }
</style>
