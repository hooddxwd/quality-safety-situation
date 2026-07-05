<template>
  <div class="sa-subtabs">
    <div
      v-for="t in tabs"
      :key="t.key"
      class="sa-subtab"
      :class="{ active: t.key === active }"
      @click="$emit('change', t.key)"
    >{{ t.label }}</div>
  </div>
</template>

<script>
export default {
  name: 'SaSubTabs',
  props: {
    active: { type: String, required: true }
  },
  data () {
    return {
      tabs: [
        { key: 'special', label: '专项分析' },
        { key: 'workplan', label: '工作计划' },
        { key: 'overall', label: '总体态势' },
        { key: 'case', label: '案例分析' },
        { key: 'pattern', label: '规律总结' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@import './theme/variables.less';

.sa-subtabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 40px;
}
.sa-subtab {
  color: @sit-text;
  font-size: 16px;
  letter-spacing: 1px;
  padding: 6px 26px;
  border-radius: 18px;
  border: 1px solid @sit-panel-border;
  background: rgba(24, 144, 255, 0.08);
  opacity: 0.6;
  cursor: pointer;
  transition: all .25s;
}
.sa-subtab:hover { opacity: 0.9; color: @sit-cyan; }
.sa-subtab.active {
  opacity: 1;
  color: @sit-cyan;
  font-weight: 700;
  border-color: @sit-cyan;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
}
</style>
