<template>
  <div class="narrative">
    <div v-for="n in data" :key="n.title" class="narr-block">
      <div class="narr-title">{{ n.title }}</div>
      <div class="narr-text">{{ n.text }}</div>
    </div>
  </div>
</template>

<script>
export default { name: 'NarrativeBox', props: { data: { type: Array, required: true } } }
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.narr-block { margin-bottom: 8px; }
.narr-title { color: @sit-blue; font-size: 13px; font-weight: 600; }
.narr-text { color: @sit-text-dim; font-size: 12px; line-height: 1.6; margin-top: 2px; }
</style>
