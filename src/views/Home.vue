<template>

  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div><img src="../assets/heima.png" alt=""><span>电商后台管理系统</span></div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px' :'200px'">

        <div class="toggle-button" @click="toggleClollapse">|||</div>

        <el-menu background-color="transparent" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="index+''" v-for="(item,index) in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[index]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavPath('/'+item1.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>
      <!-- 主题页面 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      icons: ['iconfont icon-user', 'iconfont icon-tijikongjian', 'iconfont icon-shangpin', 'iconfont icon-danju', 'iconfont icon-baobiao'],
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单失败')
      }
      this.menuList = res.data
    },
    // 点击按钮实现菜单的折叠与展开
    toggleClollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存点击的链接
    saveNavPath(val) {
      this.activePath = val
      window.sessionStorage.setItem('activePath', val)
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang='less' scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  div {
    display: flex;
    align-items: center;
    color: white;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: 0;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: white;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
