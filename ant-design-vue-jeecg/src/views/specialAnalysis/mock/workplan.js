export default {
  kpi: [
    { label: '自用问题总数', value: 126, tone: 'blue' },
    { label: '已归零数', value: 114, tone: 'green' },
    { label: '归零完成率', value: 90.5, unit: '%', tone: 'green' },
    { label: '超期归零数', value: 7, tone: 'red' }
  ],
  typeDist: {
    categories: ['设计', '工艺', '装配', '试验', '管理'],
    series: [
      { name: '重大', data: [2, 1, 1, 1, 1] },
      { name: '严重', data: [10, 12, 7, 8, 5] },
      { name: '一般', data: [18, 28, 23, 18, 9] }
    ]
  },
  stageDist: [
    { name: '研制阶段', value: 22 },
    { name: '生产阶段', value: 38 },
    { name: '交付阶段', value: 17 },
    { name: '使用维护阶段', value: 24 }
  ],
  systemRank: {
    categories: ['结构系统', '液压系统', '航电系统', '动力系统', '飞控系统'],
    values: [16, 19, 22, 25, 30]
  },
  cycle: {
    categories: ['设计', '工艺', '装配', '试验', '管理'],
    values: [24, 18, 15, 21, 13],
    threshold: 20
  },
  table: {
    columns: [
      { title: '问题编号', dataIndex: 'id' },
      { title: '机型', dataIndex: 'model' },
      { title: '问题描述', dataIndex: 'desc' },
      { title: '当前状态', dataIndex: 'status', level: true },
      { title: '剩余周期', dataIndex: 'remain' }
    ],
    rows: [
      { key: '1', id: 'ZY-2606-018', model: 'A-31', desc: '飞控通道告警', status: '督办', remain: '5天' },
      { key: '2', id: 'ZY-2606-017', model: 'B-17', desc: '液压批次一致性偏差', status: '验证中', remain: '9天' },
      { key: '3', id: 'ZY-2606-016', model: 'A-29', desc: '航电接口边界条件异常', status: '待评审', remain: '2天' },
      { key: '4', id: 'ZY-2606-015', model: 'C-08', desc: '固定工艺执行偏差', status: '整改中', remain: '7天' }
    ]
  }
}
