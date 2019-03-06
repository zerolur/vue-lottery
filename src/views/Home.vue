<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        {{collapsed?'':sysName}}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
            <el-dropdown-item @click.native="toUpdatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router v-show="!collapsed">
          <template v-for="(item,index) in nodes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
              <i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in nodes" v-if="!item.hidden" class="el-submenu item">
            <template v-if="!item.leaf">
              <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <i :class="item.iconCls"></i>
              </div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
        <el-dialog :title="title" v-model="dialogVisable" :close-on-click-modal="false" style="width:50%;margin-left:25%">
          <el-form :model="userInfo" :rules="rules" ref="updatePasswordForm" label-width="100px">
            <el-form-item label="旧密码：" prop="oldPassword">
              <el-input type="password" v-model="userInfo.oldPassword" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
              <el-input type="password" v-model="userInfo.newPassword" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="commitPassword">
              <el-input type="password" v-model="userInfo.commitPassword" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click.native="dialogVisable = false">取消</el-button>
              <el-button type="primary" @click="updatePassword">保存</el-button>
            </el-form-item>
          </el-form>
          <el-col :span="6">
          </el-col>
        </el-dialog>
      </section>
    </el-col>
  </el-row>

</template>

<script>
import { accessUserLogin } from "../api/system";
import { initUserPsw } from "../api/system";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.userInfo.newPassword !== "") {
          this.$refs.updatePasswordForm.validateField("commitPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if (value !== this.userInfo.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      sysName: "风控模型管理系统",
      collapsed: false,
      sysUserName: JSON.parse(sessionStorage.getItem("accessUser")).userName,
      sysUserAvatar: "./static/img/headImg.png",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      userInfo: {
        userId: "",
        userName: "",
        oldPassword: "",
        newPassword: "",
        commitPassword: ""
      },
      dialogVisable: false,
      title: "修改密码",
      nodes: this.$router.options.routes,
      rules: {
        oldPassword: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur"
          }
        ],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        commitPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {},
    handleopen() {},
    handleclose() {},
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          // sessionStorage.removeItem("user");
          // console.log(this.$router.options.routes);
          // this.$router.reload;
          // this.reload;
          _this.$router.replace("/login#");
          // 再次返回上一页即可
          // window.location.reload();
          // this.$router.go(0);
          // 清除动态的权限菜单
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    // 修改密码弹框
    toUpdatePassword() {
      this.dialogVisable = true;
    },
    // 修改密码保存
    updatePassword() {
      this.$refs["updatePasswordForm"].validate(valid => {
        if (valid) {
          if (this.userInfo.newPassword != this.userInfo.commitPassword) {
            this.$message({
              type: "error",
              message: "两次输入密码不一致!"
            });
          } else {
            // 校验旧密码的正确性
            let user = {
              userName: this.userInfo.userName,
              userPassword: this.userInfo.oldPassword
            };
            accessUserLogin(user).then(data => {
              let flag = data.data[0].flag;
              if (flag === "success") {
                // 旧密码校验成功
                initUserPsw({
                  userId: this.userInfo.userId,
                  psw: this.userInfo.newPassword
                }).then(data => {
                  if (data.data != "error") {
                    this.$message({
                      type: "success",
                      message: "重置密码成功!"
                      // message: "已初始化密码为:" + data.data
                    });
                  } else {
                    this.$message({
                      type: "error",
                      message: "操作失败"
                    });
                  }
                  this.$refs["updatePasswordForm"].resetFields();
                  this.dialogVisable = false;
                });
              } else {
                this.$message({
                  type: "error",
                  message: "旧密码有误"
                });
              }
            });
          }
        }
      });
    }
  },
  mounted() {
    let isLoadNodes = sessionStorage.getItem("isLoadNodes");
    if (!isLoadNodes) {
      let data = JSON.parse(window.sessionStorage.getItem("user"));
      this.nodes.push(...data);
      // console.log(this.nodes);
      sessionStorage.setItem("isLoadNodes", "true");
    }
    this.userInfo.userId = JSON.parse(
      sessionStorage.getItem("accessUser")
    ).userId;
    this.userInfo.userName = JSON.parse(
      sessionStorage.getItem("accessUser")
    ).userName;
    // console.log(this.nodes);
    // var user = sessionStorage.getItem('user');
    // if (user) {
    // 	user = JSON.parse(user);
    // 	this.sysUserName = user.name || '';
    // 	this.sysUserAvatar = user.avatar || '';
    // }
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
.el-menu {
  width: 100% !important;
}
.submenu {
  width: 200px !important;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex; // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px; // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1; // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          // color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>