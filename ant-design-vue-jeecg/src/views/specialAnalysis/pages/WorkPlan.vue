<template>
  <div class="sa-page" :style="{ backgroundImage: 'url(' + bg + ')' }">
    <div class="sa-page__stub">工作计划（建设中）</div>
  </div>
</template>

<script>
import bg from '../assets/bg-workplan.png'
export default {
  name: 'SaWorkPlan',
  data () { return { bg } }
}
</script>

<style lang="less" scoped>
.sa-page__stub {
  position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%);
  color: #fff; font-size: 40px; opacity: 0.6;
}
</style>
