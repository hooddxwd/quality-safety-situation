<template>
  <div class="center-map">
    <tech-panel :title="'分布态势地图'" tab="态势分析">
      <template v-slot:default>
        <div class="center-map__head">
          <a-button size="small" class="geo-filter">地理 ▾</a-button>
          <a-button size="small" class="analysis-btn">态势分析</a-button>
        </div>
        <div class="center-map__chart">
          <base-chart :option="option" />
        </div>
        <div class="center-map__subtabs">
          <a-button
            v-for="t in data.subTabs"
            :key="t"
            size="small"
            class="subtab"
            :class="{ active: t === activeSub }"
            @click="activeSub = t"
          >{{ t }}</a-button>
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
.center-map > .tech-panel { flex: 1; }
.center-map__head { display: flex; justify-content: flex-end; gap: 12px; margin-bottom: 8px; }
.geo-filter.ant-btn, .analysis-btn.ant-btn {
  color: @sit-blue; font-size: 14px;
  border: 1px solid @sit-panel-border; border-radius: 2px;
  background: transparent; padding: 4px 12px; height: auto;
  box-shadow: none; text-shadow: none; line-height: 1.5;
}
.geo-filter.ant-btn:hover, .analysis-btn.ant-btn:hover,
.geo-filter.ant-btn:focus, .analysis-btn.ant-btn:focus {
  color: @sit-cyan; border-color: @sit-cyan; background: transparent;
}
.center-map__chart { flex: 1; min-height: 0; }
.center-map__subtabs { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 10px; border-top: 1px solid rgba(30,74,122,0.5); }
.subtab.ant-btn {
  color: @sit-text; font-size: 14px;
  padding: 2px 8px; height: auto; line-height: 1.5;
  background: transparent; border: 0; box-shadow: none; text-shadow: none;
  border-radius: 2px;
}
.subtab.ant-btn:hover, .subtab.ant-btn:focus {
  color: @sit-text; background: transparent; border: 0; box-shadow: none;
}
.subtab.ant-btn.active {
  color: @sit-text; border: 0; background: transparent;
  border-bottom: 2px solid @sit-blue; border-radius: 0;
}
.center-map__inset { position: absolute; right: 18px; bottom: 56px; width: 150px; height: 100px;
  border: 1px solid @sit-panel-border; background: rgba(15,42,74,0.8); color: @sit-text;
  display: flex; align-items: center; justify-content: center; font-size: 14px; }
</style>
