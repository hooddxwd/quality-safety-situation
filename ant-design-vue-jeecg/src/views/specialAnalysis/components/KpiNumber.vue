<template>
  <div class="kpi-number">
    <div class="kpi-number__label">{{ item.label }}</div>
    <div v-if="item.values" class="kpi-number__multi">
      <div v-for="(v, i) in item.values" :key="i" class="kpi-multi-item">
        <span class="kpi-mini-label">{{ v.label }}</span>
        <span class="num-tech kpi-mini-val" :class="'tone-' + (v.tone || 'blue')">{{ v.value }}</span>
      </div>
    </div>
    <div v-else class="kpi-number__value num-tech" :class="'tone-' + (item.tone || 'blue')">
      {{ item.value }}<span class="kpi-number__unit">{{ item.unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaKpiNumber',
  props: { item: { type: Object, required: true } }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.kpi-number { display:flex; flex-direction:column; justify-content:center; height:100%; padding:0 16px; }
.kpi-number__label { color:@sit-text; font-size:18px; opacity:.85; }
.kpi-number__value { font-size:46px; line-height:1.1; margin-top:8px; }
.kpi-number__unit { font-size:18px; margin-left:6px; opacity:.8; font-weight:400; }
.kpi-number__multi { display:flex; gap:18px; margin-top:10px; }
.kpi-multi-item { display:flex; flex-direction:column; }
.kpi-mini-label { font-size:13px; opacity:.75; }
.kpi-mini-val { font-size:30px; line-height:1.1; }
.tone-blue { color:@sit-blue; text-shadow:0 0 8px rgba(24,144,255,.5); }
.tone-yellow { color:@sit-yellow; text-shadow:0 0 8px rgba(255,193,7,.5); }
.tone-red { color:@sit-red; text-shadow:0 0 8px rgba(255,77,79,.5); }
.tone-green { color:@sit-green; text-shadow:0 0 8px rgba(0,196,140,.5); }
</style>
