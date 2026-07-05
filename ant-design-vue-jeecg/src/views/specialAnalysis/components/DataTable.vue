<template>
  <a-table
    class="sa-table"
    :columns="columns"
    :data-source="rows"
    :pagination="false"
    size="small"
    :scroll="{ y: tableHeight }"
    row-key="key"
  >
    <template v-for="c in levelColumns" :slot="c.dataIndex" slot-scope="text">
      <span :key="c.dataIndex" class="sa-level" :class="'sa-level--' + levelClass(text)">{{ text }}</span>
    </template>
  </a-table>
</template>

<script>
export default {
  name: 'SaDataTable',
  props: {
    columns: { type: Array, required: true },
    rows: { type: Array, required: true },
    tableHeight: { type: [Number, String], default: 220 }
  },
  computed: {
    levelColumns () { return this.columns.filter(c => c.level) }
  },
  methods: {
    levelClass (v) {
      if (/重大|督办/.test(v)) return 'red'
      if (/严重|验证|整改/.test(v)) return 'yellow'
      return 'blue'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../theme/variables.less';
/deep/ .sa-table {
  background: transparent;
  .ant-table-thead > tr > th {
    background: rgba(24,144,255,.18);
    color: @sit-text;
    border-bottom: 1px solid @sit-panel-border;
    font-size: 13px;
  }
  .ant-table-tbody > tr > td {
    background: transparent;
    color: @sit-text;
    border-bottom: 1px solid rgba(24,144,255,.12);
    font-size: 13px;
  }
  .ant-table-tbody > tr:hover > td { background: rgba(24,144,255,.08); }
  .ant-table-placeholder { background: transparent; color: @sit-text; }
}
.sa-level {
  display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px;
  border: 1px solid;
}
.sa-level--red { color: @sit-red; border-color: @sit-red; background: rgba(255,77,79,.12); }
.sa-level--yellow { color: @sit-yellow; border-color: @sit-yellow; background: rgba(255,193,7,.12); }
.sa-level--blue { color: @sit-blue; border-color: @sit-blue; background: rgba(24,144,255,.12); }
</style>
