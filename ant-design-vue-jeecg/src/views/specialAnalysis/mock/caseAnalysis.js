export default {
  list: {
    columns: [
      { title: '序号', dataIndex: 'idx' },
      { title: '发生时间', dataIndex: 'time' },
      { title: '机型', dataIndex: 'model' },
      { title: '地点', dataIndex: 'place' },
      { title: '问题标题', dataIndex: 'title' },
      { title: '等级', dataIndex: 'level', level: true }
    ],
    rows: [
      { key: '1', idx: 1, time: '2026-07-04', model: 'A-31', place: '试验站', title: '地面联试偶发告警', level: '严重' },
      { key: '2', idx: 2, time: '2026-07-04', model: 'B-17', place: '附件厂', title: '压力波次超差', level: '重大' },
      { key: '3', idx: 3, time: '2026-07-04', model: 'A-29', place: '一线', title: '固定间距不一致', level: '一般' },
      { key: '4', idx: 4, time: '2026-07-04', model: 'C-08', place: '实验室', title: '高低温循环后通信异常', level: '严重' }
    ]
  },
  detailSteps: ['现象', '数据回放', '原因定位', '措施验证', '标准固化']
}
