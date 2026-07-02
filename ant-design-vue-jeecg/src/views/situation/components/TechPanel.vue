<template>
  <a-card class="tech-panel" :bordered="false">
    <div slot="title" class="tech-panel__title">{{ title }}</div>
    <div v-if="tab" slot="extra" class="tech-panel__tab">{{ tab }}</div>
    <slot />
  </a-card>
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
/* tech-panel / ant-card overrides 由 index.vue 全局引入的 situation.less 提供 */
</style>
