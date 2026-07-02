// 长页面设计稿：16:18 比例（1920×2160），宽度按 1920 等比缩放铺满视口，高度跟随产生滚动
const DESIGN_W = 1920
const DESIGN_H = 2160

export default {
  data () {
    return { scaleStyle: {}, screenStyle: {} }
  },
  mounted () {
    this.computeScale()
    window.addEventListener('resize', this.computeScale)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.computeScale)
  },
  methods: {
    computeScale () {
      const s = window.innerWidth / DESIGN_W
      this.scaleStyle = {
        width: DESIGN_W + 'px',
        height: DESIGN_H + 'px',
        position: 'absolute',
        top: '0',
        left: '0',
        transformOrigin: 'top left',
        transform: `scale(${s})`
      }
      // 容器高度 = 设计稿高度 × 缩放比，让外部文档流得到正确总高，从而产生原生滚动
      this.screenStyle = {
        position: 'relative',
        width: '100vw',
        height: (DESIGN_H * s) + 'px'
      }
    }
  }
}
