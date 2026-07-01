<template>
  <div class="metric-bar" :class="'lvl-' + level" @click="$emit('drill')">
    <div class="metric-bar__main">
      <span class="metric-bar__label">{{ item.label }}</span>
      <span class="metric-bar__value num-tech">{{ item.value }}</span>
    </div>
    <div class="metric-bar__note">
      <span class="dot" />
      <span>{{ item.note }}</span>
    </div>
    <div class="metric-bar__track"><div class="metric-bar__fill" :style="{ width: pct }" /></div>
  </div>
</template>

<script>
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
.metric-bar { padding: 6px 0; cursor: pointer; }
.metric-bar__main { display: flex; align-items: baseline; justify-content: space-between; }
.metric-bar__label { color: @sit-text-dim; font-size: 13px; }
.metric-bar__value { color: @sit-text; font-size: 26px; }
.metric-bar__note { display: flex; align-items: center; gap: 6px; color: @sit-text-dim; font-size: 12px; margin-top: 2px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: @sit-blue; }
.lvl-yellow .dot { background: @sit-yellow; }
.lvl-yellow .metric-bar__value { color: @sit-yellow; }
.lvl-red .dot { background: @sit-red; }
.lvl-red .metric-bar__value { color: @sit-red; }
.metric-bar__track { height: 3px; background: rgba(30,74,122,0.5); border-radius: 2px; margin-top: 6px; }
.metric-bar__fill { height: 100%; background: @sit-blue; border-radius: 2px; }
.lvl-yellow .metric-bar__fill { background: @sit-yellow; }
.lvl-red .metric-bar__fill { background: @sit-red; }
</style>
