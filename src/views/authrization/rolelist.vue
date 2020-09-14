<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="margin-top:20px">
      <el-button type="primary" style="margin-bottom:20px">添加角色</el-button>
      <el-table :data="rolelists" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <tr colspan="5">
              <td style="border:0px solid transparent">
                <div class="level" v-for="item in props.row.children" :key="item.id">
                  <div class="left firstlevel" style="float:left">
                    <el-tag closable type="success">{{item.authName}}</el-tag>
                  </div>
                  <div class="right">
                    <div class="level line" v-for="child in item.children" :key="child.id">
                      <div class="left lastleftlevel">
                        <el-tag type="danger" closable>{{child.authName}}</el-tag>
                      </div>
                      <div class="right lastrightlevel">
                        <div class="level" v-for="lastchild in child.children" :key="lastchild.id">
                          <el-tag type="warning" closable>{{lastchild.authName}}</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" prop="id"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
            <el-button size="mini" type="danger">分配权限</el-button>
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
      rolelists: [],
    };
  },
  created() {
    this.getRoleListsData();
  },
  methods: {
    async getRoleListsData() {
      const res = await this.$http.get("roles");
      if (res.data.meta.status === 200) {
        this.rolelists = res.data.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.firstlevel {
  width: 200px;
}
.line {
  border-bottom: 1px solid #eee;
}
.level {
  display: flex;
  align-items: center;
  margin: 5px;
  .left {
    display: flex;
  }
  .right {
  }
  .lastleftlevel {
    width: 200px;
  }
  .lastrightlevel {
    display: flex;
    justify-content: flex-start;
  }
}
</style>