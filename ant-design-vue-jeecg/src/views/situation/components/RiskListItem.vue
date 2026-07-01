<template>
  <div class="risk-item" :class="'sev-' + item.severity" @click="$emit('drill', item)">
    <div class="risk-item__head">
      <span class="risk-item__dot" />
      <span class="risk-item__title">{{ item.title }}</span>
      <span v-if="item.owner" class="risk-item__owner">/ {{ item.owner }}</span>
      <span v-if="tagText" class="risk-item__tag">{{ tagText }}</span>
    </div>
    <div class="risk-item__detail">
      {{ item.detail }}
      <span v-if="item.confidence != null" class="risk-item__conf">置信度 {{ item.confidence }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskListItem',
  props: { item: { type: Object, required: true } },
  computed: {
    tagText () { return this.item.tag || (this.item.status ? this.item.status : '') }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.risk-item { padding: 8px 0; border-bottom: 1px dashed rgba(30,74,122,0.5); cursor: pointer; }
.risk-item:last-child { border-bottom: 0; }
.risk-item__head { display: flex; align-items: center; gap: 8px; }
.risk-item__dot { width: 8px; height: 8px; border-radius: 50%; background: @sit-blue; flex: 0 0 8px; }
.sev-red .risk-item__dot { background: @sit-red; }
.sev-yellow .risk-item__dot { background: @sit-yellow; }
.risk-item__title { color: @sit-text; font-size: 14px; font-weight: 600; }
.risk-item__owner { color: @sit-text-dim; font-size: 12px; }
.risk-item__tag { margin-left: auto; color: @sit-blue; font-size: 11px; border: 1px solid @sit-blue; border-radius: 2px; padding: 0 6px; }
.risk-item__detail { color: @sit-text-dim; font-size: 12px; margin-top: 4px; padding-left: 16px; line-height: 1.5; }
.risk-item__conf { color: @sit-yellow; margin-left: 6px; }
</style>
