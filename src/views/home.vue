<template>
  <div>
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>

      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu
            unique-opened
            :default-openeds="[activeMenu]"
            router
            v-for="menu in menuLists"
            :key="menu.id"
            @open="handelOpenMenu(menu.id)"
            @close="handelCloseMenu(menu.id)"
          >
            <el-submenu :index="menu.id+''">
              <template slot="title">
                <i class="el-icon-message"></i>
                {{menu.authName}}
              </template>
              <el-menu-item
                :index="item.path"
                v-for="item in menu.children"
                :key="item.id"
              >{{item.authName}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuLists: [],
      activeMenu: "",
    };
  },
  created() {
    this.getMenuData();
  },
  mounted() {
    this.getOpenedMenuId();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$message({
        message: "退出成功！",
        type: "success",
      });
      this.$router.push("/login");
    },
    async getMenuData() {
      let res = await this.$http.get("menus");
      if (res.data.meta.status === 200) {
        this.menuLists = res.data.data;
      }
    },
    handelOpenMenu(id) {
      this.activeMenu = id + "";
      window.sessionStorage.setItem("openmenuid", id + "");
    },
    handelCloseMenu() {
      this.activeMenu = "";
      window.sessionStorage.setItem("openmenuid", "");
    },
    getOpenedMenuId() {
      this.activeMenu = window.sessionStorage.getItem("openmenuid");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>