<template>
  <section class="tech-panel">
    <header class="tech-panel__header">
      <span class="tech-panel__title">{{ title }}</span>
      <span v-if="tab" class="tech-panel__tab">{{ tab }}</span>
    </header>
    <div class="tech-panel__body"><slot /></div>
  </section>
</template>

<script>
export default {
  name: 'TechPanel',
  props: {
    title: { type: String, required: true },
    tab: { type: String, default: '' }
  }
}
</script>

<style lang="less" scoped>
/* .tech-panel / .tech-panel__* 由 index.vue 全局引入的 situation.less 提供，此处无需重复定义 */
</style>
