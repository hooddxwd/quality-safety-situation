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
    return { chart: null, ro: null }
  },
  watch: {
    option () { this.render() }
  },
  mounted () {
    ensureTheme()
    this.tryInit()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    if (this.ro) { this.ro.disconnect(); this.ro = null }
    if (this.chart) { this.chart.dispose(); this.chart = null }
  },
  methods: {
    // 容器有非零尺寸才 init，避免 echarts 在 0×0 上初始化触发 zrender 无限 drawImage 报错
    tryInit () {
      const el = this.$refs.el
      if (!el || this.chart) return
      const w = el.clientWidth
      const h = el.clientHeight
      if (w > 0 && h > 0) {
        this.chart = echarts.init(el, 'situation')
        this.render()
        if (this.ro) { this.ro.disconnect(); this.ro = null }
      } else if (!this.ro) {
        this.ro = new ResizeObserver(() => this.tryInit())
        this.ro.observe(el)
      }
    },
    render () { if (this.chart) this.chart.setOption(this.option, true) },
    onResize () { if (this.chart) this.chart.resize() }
  }
}
</script>

<style scoped>
.base-chart { width: 100%; height: 100%; }
</style>
