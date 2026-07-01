<template>
  <div class="metric-bar" :class="'lvl-' + level">
    <div class="metric-bar__row">
      <span class="metric-bar__label">{{ item.label }}</span>
      <span class="metric-bar__value num-tech">{{ item.value }}</span>
      <span class="metric-bar__tag">{{ item.note }}</span>
    </div>
    <div class="metric-bar__track"><div class="metric-bar__fill" :style="{ width: pct }" /></div>
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
    pct () {
      const v = PCT[this.item.id]
      return (v == null ? 50 : v) + '%'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.metric-bar { padding: 7px 0; }
.metric-bar__row { display: flex; align-items: center; gap: 8px; }
.metric-bar__label { color: @sit-text-dim; font-size: 13px; }
.metric-bar__value { color: @sit-text; font-size: 22px; }
.metric-bar__tag {
  margin-left: auto; font-size: 11px; padding: 1px 8px; border-radius: 10px;
  border: 1px solid; white-space: nowrap;
}
.tag-default () { color: @sit-green; border-color: rgba(0, 196, 140, 0.6); background: rgba(0, 196, 140, 0.12); }
.metric-bar__tag { .tag-default(); }
.lvl-yellow .metric-bar__tag { color: @sit-yellow; border-color: rgba(255, 193, 7, 0.6); background: rgba(255, 193, 7, 0.12); }
.lvl-yellow .metric-bar__value { color: @sit-yellow; }
.lvl-red .metric-bar__tag { color: @sit-red; border-color: rgba(255, 77, 79, 0.6); background: rgba(255, 77, 79, 0.12); }
.lvl-red .metric-bar__value { color: @sit-red; }

.metric-bar__track { height: 6px; background: rgba(24, 144, 255, 0.12); border-radius: 3px; margin-top: 6px; overflow: hidden; }
.metric-bar__fill {
  height: 100%; border-radius: 3px;
  background: linear-gradient(90deg, @sit-cyan, @sit-blue);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}
.lvl-yellow .metric-bar__fill { background: linear-gradient(90deg, #ffe082, @sit-yellow); box-shadow: 0 0 8px rgba(255, 193, 7, 0.6); }
.lvl-red .metric-bar__fill { background: linear-gradient(90deg, #ff9866, @sit-red); box-shadow: 0 0 8px rgba(255, 77, 79, 0.6); }
</style>
