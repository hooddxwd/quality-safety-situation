<template>
  <div class="sa-screen" :style="screenStyle">
    <div class="sa-stage" :style="scaleStyle">
      <router-view />

      <situation-header
        class="sa-layout-header"
        :data="header"
        active-tab="专题分析"
        @nav="onHeaderNav"
        @alert="onAlert"
      />
      <sa-sub-tabs
        class="sa-layout-subtabs"
        :active="tab"
        @change="onSubTab"
      />
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import SituationHeader from '../situation/components/SituationHeader.vue'
import headerMock from '../situation/mock/header.js'
import SaSubTabs from './SubTabs.vue'
import useScale from './useScale'

export default {
  name: 'SaLayout',
  components: { SituationHeader, SaSubTabs },
  mixins: [useScale],
  data () {
    return { header: headerMock }
  },
  computed: {
    tab () { return (this.$route.meta && this.$route.meta.tab) || 'overall' }
  },
  methods: {
    onHeaderNav (t) {
      if (t === '总体态势') return this.$router.push('/situation')
      if (t === '专题分析') return
      message.info(`「${t}」建设中`)
    },
    onAlert () { message.warning('专项分析预警（Phase1 交互壳）') },
    onSubTab (key) {
      if (key !== this.tab) this.$router.push('/special-analysis/' + key)
    }
  }
}
</script>

<style lang="less">
@import './specialAnalysis.less';

.sa-layout-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 20;
}
.sa-layout-subtabs {
  position: absolute;
  top: 125px; left: 0; right: 0;
  z-index: 20;
  background: linear-gradient(180deg, rgba(6,26,51,0.85), rgba(6,26,51,0));
}
</style>
