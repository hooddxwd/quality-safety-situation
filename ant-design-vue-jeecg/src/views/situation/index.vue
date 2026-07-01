<template>
  <div class="situation-screen">
    <div class="situation-stage" :style="scaleStyle">
      <situation-header :data="header" :active-tab="activeTab" @nav="onNav" @alert="onAlert" />
      <div class="situation-body">
        <left-column class="col col-left" />
        <center-map class="col col-center" />
        <right-column class="col col-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import useScale from './useScale'
import SituationHeader from './components/SituationHeader'
import LeftColumn from './modules/LeftColumn'
import CenterMap from './components/CenterMap'
import RightColumn from './modules/RightColumn'
import { getSituationHeader } from './api/situationApi'

export default {
  name: 'SituationIndex',
  components: { SituationHeader, LeftColumn, CenterMap, RightColumn },
  mixins: [useScale],
  data () {
    return { header: { title: '', navTabs: [], filters: {}, kpi: [], safety: [], alertBtn: '' }, activeTab: '总体态势' }
  },
  async mounted () {
    this.header = await getSituationHeader()
  },
  methods: {
    onNav (t) { this.activeTab = t; if (t !== '总体态势') message.info(`「${t}」建设中`) },
    onAlert () { message.warning('总体态势预警（Phase1 交互壳）') }
  }
}
</script>

<!-- 全局：共享大屏类（.situation-screen / .tech-panel / .num-tech）供所有子组件使用 -->
<style lang="less">
@import './situation.less';
</style>

<!-- 本页布局（scoped） -->
<style lang="less" scoped>
.situation-stage { box-sizing: border-box; display: flex; flex-direction: column; }
.situation-header-row { height: 80px; flex: 0 0 80px; }
.situation-body {
  flex: 1; display: grid;
  grid-template-columns: 420px 1fr 420px;
  gap: 12px; padding: 0 12px 12px;
}
.col {
  display: flex; flex-direction: column; gap: 12px;
  color: #fff; justify-content: center; align-items: center;
  font-size: 18px;
}
</style>
