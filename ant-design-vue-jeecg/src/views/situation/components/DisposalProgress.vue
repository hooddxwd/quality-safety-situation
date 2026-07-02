<template>
  <div class="disposal">
    <div class="disposal__summary">
      <div v-for="s in data.summary" :key="s.label" class="d-item">
        <a-statistic class="d-value num-tech" :value="s.value" group-separator="" />
        <span class="d-label">{{ s.label }}</span>
      </div>
    </div>
    <div class="disposal__item">
      <div class="d-item-head">
        <a-tag class="d-type">{{ data.item.type }}</a-tag>
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
.disposal__summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.d-item { display: flex; flex-direction: column; align-items: center; }
.d-value /deep/ .ant-statistic-content { color: @sit-blue; font-size: 28px; line-height: 1.1; }
.d-label { color: @sit-text; font-size: 14px; margin-top: 6px; }
.disposal__item { margin-top: 14px; border-top: 1px dashed rgba(30,74,122,0.5); padding-top: 12px; }
.d-item-head { display: flex; align-items: center; gap: 10px; }
.d-type.ant-tag {
  margin: 0;
  color: #fff; background: @sit-blue;
  font-size: 13px; border: 0; border-radius: 2px; padding: 2px 8px;
  line-height: 18px;
}
.d-title { color: @sit-text; font-size: 16px; }
.d-status { margin-left: auto; color: @sit-yellow; font-size: 14px; }
.d-detail { color: @sit-text; font-size: 14px; margin-top: 6px; line-height: 1.6; }
</style>
