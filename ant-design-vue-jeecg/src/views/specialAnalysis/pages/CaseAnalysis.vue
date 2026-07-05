<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="sa-slot" :style="{ left:'2%', top:'18%', width:'38%', height:'72%' }">
      <data-table :columns="data.list.columns" :rows="data.list.rows" :table-height="520" />
    </div>
    <div class="sa-slot case-detail" :style="{ left:'42%', top:'18%', width:'56%', height:'72%' }">
      <div class="case-detail__empty">选中左侧案例查看详情</div>
      <div class="case-detail__steps">
        <a-button v-for="s in data.detailSteps" :key="s" class="case-step" @click="onStep(s)">{{ s }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import bg from '../assets/bg-case.png'
import { getCaseData } from '../api/specialApi'
import DataTable from '../components/DataTable.vue'

export default {
  name: 'SaCaseAnalysis',
  components: { DataTable },
  data () {
    return { bg, data: { list: { columns: [], rows: [] }, detailSteps: [] } }
  },
  async mounted () { this.data = await getCaseData() },
  methods: {
    onStep (s) { message.info(`「${s}」建设中`) }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.case-detail { display:flex; flex-direction:column; background: rgba(6,26,51,.6); }
.case-detail__empty { flex:1; display:flex; align-items:center; justify-content:center; color:@sit-text; opacity:.5; font-size:18px; }
.case-detail__steps { display:flex; justify-content:center; gap:14px; padding:16px; }
.case-step.ant-btn { background:rgba(24,144,255,.12); color:@sit-cyan; border:1px solid @sit-panel-border; border-radius:16px; }
.case-step.ant-btn:hover { background:rgba(0,229,255,.18); border-color:@sit-cyan; }
</style>
