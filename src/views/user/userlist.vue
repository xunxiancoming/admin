<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div class="top">
        <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="handelSearch">
          <el-button slot="append" icon="el-icon-search" @click="handelSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="handelAddUser">添加用户</el-button>
      </div>

      <el-dialog
        :title="formType=='create'?'添加用户':'更新用户'"
        :visible.sync="adduserVisible"
        width="30%"
      >
        <el-form label-width="80px" :model="user" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="user.username" :disabled="formType=='create'?false:true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="formType=='create'?true:false">
            <el-input v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="user.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adduserVisible = false">取 消</el-button>
          <el-button type="primary" @click="handelsubmitAddUser">确 定</el-button>
        </span>
      </el-dialog>

      <div class="content">
        <el-table :data="userlists.users" border style="width: 100%">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="username" label="姓名" width="180"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#eaecf0"
                @change="handelStateChange(scope)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="handelEdit(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handelDel(scope.row)"
              ></el-button>
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userlists.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    let emailValidator = (rule, value, callback) => {
      let regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
      if (!regexp.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      }
    };
    let phoneValidator = (rule, value, callback) => {
      let regexp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      if (!regexp.test(value)) {
        return callback(new Error("手机号码不正确"));
      }
    };
    return {
      userlists: {},
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      adduserVisible: false,
      formType: "create",
      user: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: {
          required: true,
          message: "用户名不能为空",
          trigger: "blur",
        },
        password: [
          {
            required: true,
            message: "密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 16,
            message: "密码长度在6——16位之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            validator: emailValidator,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            validator: phoneValidator,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserListsData();
  },
  methods: {
    async getUserListsData() {
      const res = await this.$http.get(
        `users?query=${this.params.query}&pagenum=${this.params.pagenum}&pagesize=${this.params.pagesize}`
      );
      if (res.data.meta.status === 200) {
        this.userlists = res.data.data;
      }
    },
    handleSizeChange(pagesize) {
      this.params.pagesize = pagesize;
      this.getUserListsData();
    },
    handleCurrentChange(pagenum) {
      this.params.pagenum = pagenum;
      this.getUserListsData();
    },
    async handelStateChange(user) {
      const res = await this.$http.put(
        `users/${user.row.id}/state/${user.row.mg_state}`
      );
      if (res.data.meta.status === 200) {
        this.$message({
          message: "状态更新成功",
          type: "success",
        });
      }
    },
    async handelSearch() {
      this.getUserListsData();
    },
    handelAddUser() {
      this.adduserVisible = true;
      this.formType = "create";
    },
    async handelsubmitAddUser() {
      let res;
      if (this.formType == "create") {
        res = await this.$http.post("users", this.user);
      } else {
        res = await this.$http.put(`users/${this.user.id}`, this.user);
      }
      if (res.data.meta.status === 201 || res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
        });
        this.adduserVisible = false;
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "warning",
        });
        this.adduserVisible = false;
      }
    },
    handelEdit(user) {
      this.user = {};
      this.adduserVisible = true;
      this.formType = "edit";
      this.user = user;
    },
    async handelDel(user) {
      const res = await this.$http.delete(`users/${user.id}`);
      this.$confirm(`确认删除用户"${user.username}"?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: "success",
            });
            this.getUserListsData();
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.box-card {
  .top {
    width: 100%;
    margin-bottom: 20px;
    .el-input {
      width: 300px;
      margin-right: 20px;
    }
  }
  .footer {
    margin-top: 20px;
  }
}
</style>