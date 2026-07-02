<template>
  <div class="sit-header">
    <!-- 标题文字已 baked-in 到背景图,左侧保留占位让 nav 居中 -->
    <div class="sit-header__title-slot"></div>
    <nav class="sit-header__nav">
      <a-button
        v-for="t in data.navTabs"
        :key="t"
        class="sit-header__tab"
        :class="{ active: t === activeTab }"
        @click="$emit('nav', t)"
      >{{ t }}</a-button>
    </nav>
    <div class="sit-header__ctrl">
      <a-tag class="sit-header__filter">{{ data.filters.base }}</a-tag>
      <a-tag class="sit-header__filter">{{ data.filters.role }}</a-tag>
      <a-button class="sit-header__alert" @click="$emit('alert')">{{ data.alertBtn }}</a-button>
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
  position: relative;
  display: flex; align-items: flex-start; gap: 16px;
  padding: 22px 24px 0; height: 125px; flex: 0 0 125px;
  background: url('../assets/header-frame.png') center center / 100% 100% no-repeat;
  color: @sit-text;
}

// 标题 baked-in 到背景图,这里仅占位让 nav 居中
.sit-header__title-slot {
  flex: 0 0 32%;
  min-width: 360px;
}

.sit-header__nav {
  flex: 1; display: flex; justify-content: center; align-items: center; gap: 6px;
  flex-wrap: nowrap; height: 36px;
}

// a-button 导航 tab：白底胶囊底图 + 淡蓝描边柔光
.sit-header__tab.ant-btn {
  background: url('../assets/nav-btn.png') center center / 100% 100% no-repeat;
  color: #FFFFFF;
  font-size: 16px; font-weight: 600; letter-spacing: 1px;
  padding: 6px 22px; border: 0; border-radius: 18px;
  opacity: 0.55; transition: all .25s;
  white-space: nowrap; flex-shrink: 0;
  height: 36px; line-height: 1.2;
  box-shadow: none; text-shadow: none;
  min-width: 0;
}
.sit-header__tab.ant-btn > span { color: inherit; text-shadow: none; line-height: inherit; }
.sit-header__tab.ant-btn:hover,
.sit-header__tab.ant-btn:focus,
.sit-header__tab.ant-btn:active {
  opacity: 0.85; color: @sit-blue;
  background: url('../assets/nav-btn.png') center center / 100% 100% no-repeat;
  border: 0; box-shadow: none;
}
.sit-header__tab.ant-btn.active {
  opacity: 1;
  color: @sit-blue;
  font-weight: 700;
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.85));
}

.sit-header__ctrl { display: flex; align-items: center; gap: 12px; height: 36px; }

// a-tag 过滤器：胶囊形淡蓝描边
.sit-header__filter.ant-tag {
  margin: 0;
  color: @sit-text; font-size: 14px;
  border: 1px solid @sit-panel-border; border-radius: 14px; padding: 4px 14px;
  background: rgba(24, 144, 255, 0.06);
  line-height: 1.5;
}

// a-button 预警按钮：橙红渐变
.sit-header__alert.ant-btn {
  background: linear-gradient(90deg, #ff7a45, @sit-red);
  color: #fff; border: 0; border-radius: 14px; padding: 5px 18px;
  font-size: 14px; box-shadow: 0 0 10px rgba(255, 77, 79, 0.5);
  height: auto; text-shadow: none;
}
.sit-header__alert.ant-btn:hover,
.sit-header__alert.ant-btn:focus {
  background: linear-gradient(90deg, #ff7a45, @sit-red);
  color: #fff; border: 0; box-shadow: 0 0 14px rgba(255, 77, 79, 0.7);
}
.sit-header__clock { color: @sit-cyan; font-size: 18px; margin-left: 4px; white-space: nowrap; }
</style>
