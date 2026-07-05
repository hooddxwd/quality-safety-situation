export default {
  kpi: [
    { label: '质量问题总数', value: 286, unit: '', tone: 'blue' },
    { label: '自用产品问题数', value: 126, unit: '', tone: 'blue' },
    { label: '出口产品问题数', value: 82, unit: '', tone: 'blue' },
    { label: '民用产品问题数', value: 78, unit: '', tone: 'blue' },
    { label: '分级问题统计', values: [
      { label: '重大', value: 6, tone: 'red' },
      { label: '严重', value: 42, tone: 'yellow' },
      { label: '一般', value: 238, tone: 'blue' }
    ] },
    { label: '问题闭环率', value: 91.6, unit: '%', tone: 'green' }
  ],
  userDist: [
    { name: '部队用户', value: 120 },
    { name: '出口用户', value: 45 },
    { name: '民航用户', value: 38 },
    { name: '试验用户', value: 30 },
    { name: '维修保障单位', value: 53 }
  ],
  trend: {
    categories: ['A-31', 'A-29', 'B-17', 'C-18', 'D-12', '保障装备'],
    bars: [
      { name: '重大', data: [2, 1, 1, 1, 1, 0], color: '#ff4d4f' },
      { name: '严重', data: [12, 9, 7, 8, 4, 2], color: '#ffc107' }
    ],
    line: { name: '万时率', data: [0.8, 0.7, 1.1, 0.9, 0.6, 0.5], color: '#00e5ff' }
  },
  reasonCat: [
    { name: '设计原因', value: 58 }, { name: '制造原因', value: 46 },
    { name: '装配原因', value: 39 }, { name: '器材原因', value: 34 },
    { name: '使用维护原因', value: 48 }, { name: '管理原因', value: 31 },
    { name: '待查原因', value: 30 }
  ],
  modelDist: [
    { name: 'A-31', value: 40 }, { name: 'A-29', value: 28 },
    { name: 'B-17', value: 22 }, { name: 'C-18', value: 18 },
    { name: 'D-12', value: 12 }, { name: '保障装备', value: 6 }
  ],
  unitDist: {
    categories: ['设计院', '总装厂', '附件厂', '试验站', '供应商'],
    series: [
      { name: '重大', data: [1, 2, 1, 1, 1] },
      { name: '严重', data: [8, 10, 7, 9, 8] },
      { name: '一般', data: [40, 52, 45, 48, 53] }
    ]
  },
  systemShare: [
    { name: '飞控系统', value: 38 }, { name: '动力系统', value: 30 },
    { name: '航电系统', value: 26 }, { name: '液压系统', value: 22 },
    { name: '结构系统', value: 18 }, { name: '保障设备', value: 14 }
  ],
  conclusion: {
    evaluation: '上半年三大品类问题总量处于受控区间，闭环率保持 90% 以上，质量安全总体平稳。',
    features: '自用产品问题占比最高，设计/制造环节为主因；A-31 型号与飞控系统为重点关注对象。',
    risks: '重大问题 6 项需重点督办，部分出口产品问题归零周期偏长，存在超期风险。'
  }
}
