<template>
  <div class="numbered-list">
    <div v-for="(it, i) in items" :key="i" class="nl-item">
      <span class="nl-idx">{{ i + 1 }}</span>
      <div class="nl-body">
        <div class="nl-title">{{ it.title }}</div>
        <div class="nl-desc">{{ it.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SaNumberedList',
  props: { items: { type: Array, required: true } }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.numbered-list { display:flex; flex-direction:column; gap:14px; padding:14px 16px; overflow:auto; height:100%; }
.nl-item { display:flex; gap:12px; }
.nl-idx {
  flex:0 0 26px; height:26px; border-radius:50%;
  background:linear-gradient(135deg,@sit-cyan,@sit-blue); color:#fff;
  display:flex; align-items:center; justify-content:center; font-weight:700;
  box-shadow:0 0 8px rgba(0,229,255,.5);
}
.nl-title { color:@sit-text; font-size:16px; font-weight:600; }
.nl-desc { color:@sit-text; opacity:.75; font-size:13px; margin-top:4px; line-height:1.5; }
</style>
