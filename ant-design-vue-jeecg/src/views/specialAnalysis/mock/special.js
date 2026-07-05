export default {
  gantt: {
    rows: [
      { name: '高发系统整治', segments: [{ start: 0, end: 5 }] },
      { name: '重复性问题清零', segments: [{ start: 2, end: 8 }] },
      { name: '薄弱环节攻关', segments: [{ start: 4, end: 9 }] },
      { name: '供应链提升', segments: [{ start: 6, end: 11 }] }
    ],
    monthCount: 11
  },
  capability: [
    { title: '预警机制建设', desc: '建立分级阈值，趋势偏离和重复性问题自动预警。' },
    { title: '指标体系搭建', desc: '完善型号、系统、单位、阶段四级质量指标。' },
    { title: '可视化大屏应用', desc: '形成月度态势、专项治理和风险督办联动驾驶舱。' },
    { title: '智能分析模型引入', desc: '引入关联规则、异常检测和归零周期预测模型。' }
  ],
  safeguard: [
    { title: '组织保障', desc: '建立型号总师、质量、工艺、供应链联合例会和督办机制。' },
    { title: '技术保障', desc: '强化仿真、试验、故障复现和技术归零专家资源投入。' },
    { title: '制度保障', desc: '完善超期归零问责、重复问题清零和供应商质量评价制度。' },
    { title: '数据保障', desc: '打通问题登记、处置、验证、关闭全链路数据口径。' }
  ],
  goals: [
    { label: '质量稳定性提升', value: 72 },
    { label: '问题发生率下降', value: 35 },
    { label: '闭环效率提升', value: 82 },
    { label: '预警能力增强', value: 67 }
  ]
}
