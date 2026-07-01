<template>
  <div class="sit-header">
    <div class="sit-header__title num-tech">{{ data.title }}</div>
    <nav class="sit-header__nav">
      <span
        v-for="t in data.navTabs"
        :key="t"
        class="sit-header__tab"
        :class="{ active: t === activeTab }"
        @click="$emit('nav', t)"
      >{{ t }}</span>
    </nav>
    <div class="sit-header__ctrl">
      <span class="sit-header__filter">{{ data.filters.base }}</span>
      <span class="sit-header__filter">{{ data.filters.role }}</span>
      <button class="sit-header__alert" @click="$emit('alert')">{{ data.alertBtn }}</button>
      <span class="sit-header__clock num-tech">{{ clock }}</span>
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
.sit-header {
  display: flex; align-items: center; gap: 16px;
  padding: 0 20px; height: 64px; flex: 0 0 64px;
  color: @sit-text;
}
.sit-header__title {
  font-size: 24px; font-weight: 700; letter-spacing: 2px; white-space: nowrap;
  background: linear-gradient(180deg, #ffffff 35%, @sit-cyan);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 14px rgba(0, 229, 255, 0.35);
}
.sit-header__nav { flex: 1; display: flex; justify-content: center; gap: 6px; }
.sit-header__tab {
  color: @sit-text-dim; font-size: 13px; cursor: pointer;
  padding: 5px 16px; border-radius: 14px;
  border: 1px solid transparent; transition: all .2s;
}
.sit-header__tab:hover { color: #fff; }
.sit-header__tab.active {
  color: #fff;
  background: rgba(24, 144, 255, 0.18);
  border-color: rgba(0, 229, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.35);
}
.sit-header__ctrl { display: flex; align-items: center; gap: 8px; }
.sit-header__filter {
  color: @sit-text-dim; font-size: 12px;
  border: 1px solid @sit-panel-border; border-radius: 12px; padding: 4px 12px;
  background: rgba(24, 144, 255, 0.06);
}
.sit-header__alert {
  background: linear-gradient(90deg, #ff7a45, @sit-red);
  color: #fff; border: 0; border-radius: 14px; padding: 5px 14px;
  cursor: pointer; font-size: 12px; box-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
}
.sit-header__clock { color: @sit-cyan; font-size: 14px; margin-left: 4px; white-space: nowrap; }
</style>
