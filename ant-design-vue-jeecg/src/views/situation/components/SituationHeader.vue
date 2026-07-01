<template>
  <div class="sit-header">
    <div class="sit-header__top">
      <div class="sit-header__title num-tech">{{ data.title }}</div>
      <nav class="sit-header__nav">
        <span v-for="t in data.navTabs" :key="t" class="sit-header__tab" :class="{ active: t === activeTab }" @click="$emit('nav', t)">{{ t }}</span>
      </nav>
      <div class="sit-header__ctrl">
        <span class="sit-header__filter">{{ data.filters.base }}</span>
        <span class="sit-header__filter">{{ data.filters.role }}</span>
        <button class="sit-header__alert" @click="$emit('alert')">{{ data.alertBtn }}</button>
      </div>
    </div>
    <div class="sit-header__kpi">
      <div v-for="k in data.kpi" :key="k.label" class="kpi-item">
        <span class="kpi-label">{{ k.label }}</span>
        <span class="kpi-value num-tech">{{ k.value }}<small>{{ k.unit }}</small></span>
      </div>
      <div class="kpi-sep" />
      <div class="kpi-group">
        <div v-for="s in data.safety" :key="s.label" class="kpi-item">
          <span class="kpi-label">{{ s.label }}</span>
          <span class="kpi-value num-tech">{{ s.value }}<small>{{ s.unit }}</small></span>
        </div>
      </div>
      <div class="kpi-clock num-tech">{{ clock }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SituationHeader',
  props: {
    data: { type: Object, required: true },
    activeTab: { type: String, default: '总体态势' }
  },
  data () { return { clock: '', timer: null } },
  mounted () {
    const pad = (n) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      this.clock = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }
    tick()
    this.timer = setInterval(tick, 1000)
  },
  beforeDestroy () { if (this.timer) clearInterval(this.timer) }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
.sit-header { color: @sit-text; }
.sit-header__top { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 56px; }
.sit-header__title { font-size: 26px; font-weight: 700; letter-spacing: 2px;
  background: linear-gradient(180deg, #ffffff, #40a9ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.sit-header__nav { display: flex; gap: 22px; }
.sit-header__tab { color: @sit-text-dim; font-size: 14px; cursor: pointer; padding: 4px 2px; }
.sit-header__tab.active { color: @sit-text; border-bottom: 2px solid @sit-blue; }
.sit-header__ctrl { display: flex; align-items: center; gap: 10px; }
.sit-header__filter { color: @sit-text-dim; font-size: 12px; border: 1px solid @sit-panel-border; border-radius: 2px; padding: 3px 10px; }
.sit-header__alert { background: @sit-red; color: #fff; border: 0; border-radius: 2px; padding: 5px 12px; cursor: pointer; font-size: 12px; }
.sit-header__kpi { display: flex; align-items: center; gap: 26px; padding: 6px 16px; border-top: 1px solid rgba(30,74,122,0.6); border-bottom: 1px solid rgba(30,74,122,0.6); }
.kpi-item { display: flex; flex-direction: column; }
.kpi-label { color: @sit-text-dim; font-size: 12px; }
.kpi-value { color: @sit-text; font-size: 22px; }
.kpi-value small { font-size: 12px; margin-left: 3px; color: @sit-text-dim; }
.kpi-sep { width: 1px; height: 28px; background: rgba(30,74,122,0.8); }
.kpi-group { display: flex; gap: 26px; }
.kpi-clock { margin-left: auto; color: @sit-blue; font-size: 16px; }
</style>
