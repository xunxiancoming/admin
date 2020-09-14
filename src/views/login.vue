<template>
  <div class="login">
    <el-form label-width="80px" :model="user" :rules="rules" ref="login">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handelLogin('login')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { max: 16, min: 6, message: "密码在6-16位之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handelLogin(login) {
      this.$refs[login].validate(async (valid) => {
        if (valid) {
          let res = await this.$http.post("login", this.user);
          console.log(res);
          if (res.data.meta.status == 200) {
            window.sessionStorage.setItem("token", res.data.data.token);
            this.$message({
              message: "登录成功",
              type: "success",
            });
            this.$router.push("/home");
          } else {
            this.$message.error(res.data.meta.msg);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 400px;
  }
}
</style>