export default {
  title: '航空装备质量安全态势·主动防御大屏',
  navTabs: ['总体态势', '态势改版', '画像中心', '专题分析', '分析工作台', '指标与模型', '全链路留痕'], // ⚠️核对
  filters: {
    base: '基地·机队分队',
    role: '综合视图(不过滤)'
  },
  kpi: [
    { label: '飞机数', value: 240, unit: '架' },
    { label: '飞行小时数', value: 18000, unit: 'h/日' },
    { label: '在修数', value: 18, unit: '架' },
    { label: '综合指数', value: 82.1, unit: '分' }
  ],
  safety: [
    { label: '事故数', value: 0, unit: '起' },
    { label: '事故征候数', value: 3, unit: '起' },
    { label: '质量问题数', value: 156, unit: '项' },
    { label: '问题处置用户满意度', value: 96, unit: '%' }
  ],
  alertBtn: '总体态势预警'
}
