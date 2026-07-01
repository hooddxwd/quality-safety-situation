<template>
  <div class="disposal">
    <div class="disposal__summary">
      <div v-for="s in data.summary" :key="s.label" class="d-item">
        <span class="d-value num-tech">{{ s.value }}</span>
        <span class="d-label">{{ s.label }}</span>
      </div>
    </div>
    <div class="disposal__item">
      <div class="d-item-head">
        <span class="d-type">{{ data.item.type }}</span>
        <span class="d-title">{{ data.item.title }}</span>
        <span class="d-status">{{ data.item.status }}</span>
      </div>
      <div class="d-detail">{{ data.item.detail }}</div>
    </div>
  </div>
</template>

<script>
export default { name: 'DisposalProgress', props: { data: { type: Object, required: true } } }
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.disposal__summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-value { color: @sit-blue; font-size: 22px; }
.d-label { color: @sit-text-dim; font-size: 12px; }
.disposal__item { margin-top: 10px; border-top: 1px dashed rgba(30,74,122,0.5); padding-top: 8px; }
.d-item-head { display: flex; align-items: center; gap: 8px; }
.d-type { color: #fff; background: @sit-blue; font-size: 11px; border-radius: 2px; padding: 1px 6px; }
.d-title { color: @sit-text; font-size: 13px; }
.d-status { margin-left: auto; color: @sit-yellow; font-size: 12px; }
.d-detail { color: @sit-text-dim; font-size: 12px; margin-top: 4px; line-height: 1.5; }
</style>
