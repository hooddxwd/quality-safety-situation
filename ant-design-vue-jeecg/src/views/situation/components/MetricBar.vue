<template>
  <div class="metric-bar" :class="'lvl-' + level">
    <div class="metric-bar__row">
      <span class="metric-bar__label">{{ item.label }}</span>
      <span class="metric-bar__value num-tech">{{ item.value }}</span>
      <span class="metric-bar__tag">{{ item.note }}</span>
    </div>
    <a-progress
      :percent="percentNum"
      :show-info="false"
      :stroke-color="strokeColor"
      size="small"
      class="metric-bar__progress"
    />
  </div>
</template>

<script>
// 占位百分比（Phase1 写死；Phase2 由真实数据派生）
const PCT = { q1: 10, q2: 45, q3: 47, q4: 75, q5: 74, t1: 88, t2: 21, t3: 14, t4: 64, t5: 60 }
export default {
  name: 'MetricBar',
  props: {
    item: { type: Object, required: true }, // { id, label, value, note, level }
    level: { type: String, default: 'green' }
  },
  computed: {
    percentNum () {
      const v = PCT[this.item.id]
      return v == null ? 50 : v
    },
    strokeColor () {
      if (this.level === 'red') return { from: '#ff9866', to: '#ff4d4f' }
      if (this.level === 'yellow') return { from: '#ffe082', to: '#ffc107' }
      return { from: '#00e5ff', to: '#1890ff' }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.metric-bar { padding: 10px 0; }
.metric-bar__row { display: flex; align-items: center; gap: 12px; }
.metric-bar__label { color: @sit-text; font-size: 16px; }
.metric-bar__value { color: @sit-text; font-size: 28px; }
.metric-bar__tag {
  margin-left: auto; font-size: 13px; padding: 2px 10px; border-radius: 12px;
  border: 1px solid; white-space: nowrap;
  color: @sit-green; border-color: rgba(0, 196, 140, 0.6); background: rgba(0, 196, 140, 0.12);
}
.lvl-yellow .metric-bar__tag { color: @sit-yellow; border-color: rgba(255, 193, 7, 0.6); background: rgba(255, 193, 7, 0.12); }
.lvl-yellow .metric-bar__value { color: @sit-yellow; }
.lvl-red .metric-bar__tag { color: @sit-red; border-color: rgba(255, 77, 79, 0.6); background: rgba(255, 77, 79, 0.12); }
.lvl-red .metric-bar__value { color: @sit-red; }

// a-progress 覆盖默认 trail 颜色与圆角发光
.metric-bar__progress { margin-top: 8px; padding: 0 !important; }
.metric-bar__progress /deep/ .ant-progress-outer { background: rgba(24, 144, 255, 0.12); border-radius: 4px; }
.metric-bar__progress /deep/ .ant-progress-inner { background: transparent; border-radius: 4px; }
.metric-bar__progress /deep/ .ant-progress-bg {
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
  height: 8px !important;
}
.lvl-yellow /deep/ .ant-progress-bg { box-shadow: 0 0 8px rgba(255, 193, 7, 0.6) !important; }
.lvl-red /deep/ .ant-progress-bg { box-shadow: 0 0 8px rgba(255, 77, 79, 0.6) !important; }
</style>
