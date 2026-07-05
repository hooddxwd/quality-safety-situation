// 16:9 单屏：min(宽比,高比) 缩放并居中，非 16:9 留黑边，无滚动
const DESIGN_W = 1920
const DESIGN_H = 1080

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
      const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
      this.scaleStyle = {
        width: DESIGN_W + 'px',
        height: DESIGN_H + 'px',
        position: 'absolute',
        left: ((window.innerWidth - DESIGN_W * s) / 2) + 'px',
        top: ((window.innerHeight - DESIGN_H * s) / 2) + 'px',
        transformOrigin: '0 0',
        transform: `scale(${s})`
      }
      this.screenStyle = {
        position: 'fixed',
        top: '0', left: '0', right: '0', bottom: '0',
        overflow: 'hidden',
        background: '#061a33'
      }
    }
  }
}
