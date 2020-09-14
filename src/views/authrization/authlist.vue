<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="authlists" border style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.level==0?'primary':scope.row.level==1?'warning':'danger'"
              plain
              size="mini"
            >{{scope.row.level | change}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authlists: [],
    };
  },
  filters: {
    change(value) {
      let text;
      switch (value) {
        case "0":
          text = "一级";
          break;
        case "1":
          text = "二级";
          break;
        case "2":
          text = "三级";
          break;
      }
      return text;
    },
  },
  created() {
    this.getAuthListsData();
  },
  methods: {
    async getAuthListsData() {
      let type = "list";
      const res = await this.$http.get(`rights/${type}`);
      if (res.data.meta.status === 200) {
        this.authlists = res.data.data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-card {
  margin-top: 20px;
}
</style>