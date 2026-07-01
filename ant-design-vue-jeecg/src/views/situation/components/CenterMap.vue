<template>
  <div class="center-map">
    <tech-panel :title="'分布态势地图'" tab="态势分析">
      <template v-slot:default>
        <div class="center-map__head">
          <span class="geo-filter">地理 ▾</span>
          <span class="analysis-btn">态势分析</span>
        </div>
        <div class="center-map__chart">
          <base-chart :option="option" />
        </div>
        <div class="center-map__subtabs">
          <span v-for="t in data.subTabs" :key="t" class="subtab" :class="{ active: t === activeSub }" @click="activeSub = t">{{ t }}</span>
        </div>
      </template>
    </tech-panel>
    <div class="center-map__inset"><span>局部放大</span></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaGeo from '../assets/china.geo.json'
import BaseChart from './BaseChart'
import TechPanel from './TechPanel'
import { getCenterMap } from '../api/situationApi'

let mapRegistered = false
function ensureMap () {
  if (!mapRegistered) { echarts.registerMap('china', chinaGeo); mapRegistered = true }
}

export default {
  name: 'CenterMap',
  components: { BaseChart, TechPanel },
  data () { return { data: { points: [], lines: [], subTabs: [] }, activeSub: '' } },
  computed: {
    option () {
      ensureMap()
      return {
        geo: {
          map: 'china', roam: false,
          itemStyle: { areaColor: '#0f2a4a', borderColor: '#2f6aa0' },
          emphasis: { itemStyle: { areaColor: '#16456e' } },
          label: { show: false }
        },
        series: [
          {
            type: 'effectScatter', coordinateSystem: 'geo',
            data: this.data.points.map(p => ({ name: p.name, value: p.value, level: p.level })),
            symbolSize: 12, rippleEffect: { scale: 4 },
            itemStyle: {
              color: (params) => ({ red: '#ff4d4f', yellow: '#faad14', green: '#52c41a' })[params.data.level] || '#40a9ff'
            }
          },
          {
            type: 'lines', coordinateSystem: 'geo',
            data: this.data.lines,
            effect: { show: true, period: 5, trailLength: 0.4, symbolSize: 5 },
            lineStyle: { color: '#40a9ff', width: 1, opacity: 0.6, curveness: 0.2 }
          }
        ]
      }
    }
  },
  async mounted () {
    this.data = await getCenterMap()
    this.activeSub = this.data.subTabs[0] || ''
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.center-map { height: 100%; position: relative; display: flex; }
.center-map > section.tech-panel { flex: 1; }
.center-map__head { display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 4px; }
.geo-filter, .analysis-btn { color: @sit-blue; font-size: 12px; border: 1px solid @sit-panel-border; border-radius: 2px; padding: 2px 8px; }
.center-map__chart { flex: 1; min-height: 0; }
.center-map__subtabs { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 6px; border-top: 1px solid rgba(30,74,122,0.5); }
.subtab { color: @sit-text-dim; font-size: 12px; cursor: pointer; padding: 2px 6px; }
.subtab.active { color: @sit-text; border-bottom: 2px solid @sit-blue; }
.center-map__inset { position: absolute; right: 18px; bottom: 56px; width: 130px; height: 90px;
  border: 1px solid @sit-panel-border; background: rgba(15,42,74,0.8); color: @sit-text-dim;
  display: flex; align-items: center; justify-content: center; font-size: 12px; }
</style>
