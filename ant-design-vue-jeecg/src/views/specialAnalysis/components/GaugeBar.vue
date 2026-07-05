<template>
  <div class="gauge-bar">
    <div class="gauge-bar__label">{{ item.label }}</div>
    <div class="gauge-bar__track">
      <div class="gauge-bar__fill" :style="{ width: item.value + '%' }"></div>
    </div>
    <div class="gauge-bar__value num-tech">{{ item.value }}%</div>
  </div>
</template>

<script>
export default {
  name: 'SaGaugeBar',
  props: { item: { type: Object, required: true } }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.gauge-bar { display:flex; flex-direction:column; justify-content:center; height:100%; padding:0 18px; gap:10px; }
.gauge-bar__label { color:@sit-text; font-size:17px; }
.gauge-bar__track { height:14px; border-radius:7px; background:rgba(255,255,255,.12); overflow:hidden; }
.gauge-bar__fill { height:100%; border-radius:7px;
  background:linear-gradient(90deg,@sit-cyan,@sit-green); box-shadow:0 0 10px rgba(0,229,255,.6); transition:width .6s; }
.gauge-bar__value { font-size:34px; color:@sit-cyan; text-shadow:0 0 8px rgba(0,229,255,.5); }
</style>
