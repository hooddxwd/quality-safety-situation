// 1920×1080 设计稿等比缩放：按视口最小比例缩放并居中
const DESIGN_W = 1920
const DESIGN_H = 1080

export default {
  data () {
    return { scaleStyle: {} }
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
        left: '50%',
        top: '50%',
        transformOrigin: 'center center',
        transform: `translate(-50%, -50%) scale(${s})`
      }
    }
  }
}
