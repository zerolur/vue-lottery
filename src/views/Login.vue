<template>
  <div>
    <el-row style="margin-top:8%">
      <el-col>
        <!-- 123 -->
      </el-col>
    </el-row>
    <el-row class="snow" id="snow">
      <el-col :span="10" :offset="12" class="">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
          <!-- <h3 class="title">系统登录</h3> -->
          <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" @keydown.enter.native="handleSubmit2" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
          <p>&nbsp;</p>
          <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { requestLogin } from "../api/api";
import { accessUserLogin, getUserAccessMenu } from "../api/system";
import NProgress from "nprogress";
import MenuUtils from "@/utils/MenuUtils";
var routers = [];
//import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
          //{ validator: validaePass }
        ],
        checkPass: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    login(data) {
      window.sessionStorage.setItem("user", JSON.stringify(data));
      MenuUtils(routers, data);
    },
    handleSubmit2(ev) {
      var _this = this;
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          let user = {
            userName: this.ruleForm2.account,
            userPassword: this.ruleForm2.checkPass
          };
          accessUserLogin(user).then(data => {
            let flag = data.data[0].flag;
            if (flag === "success") {
              //sessionStorage中保存登录用户的Id
              sessionStorage.setItem(
                "accessUser",
                JSON.stringify(data.data[0].accessUser)
              );
              getUserAccessMenu({
                userId: data.data[0].accessUser.userId
              }).then(data => {
                let res2 = data.data;
                this.login(res2);

                this.$router.addRoutes(routers);
                this.$router.push({
                  path: "/riskModelMonitor"
                });
              });
            } else {
              this.$message({
                type: "error",
                message: flag
              });
            }
          });
          // getUserAccessMenu().then(data => {
          //   let res2 = data.data;
          //   this.login(res2);
          //   this.$router.addRoutes(routers);
          //   this.$router.push({
          //     path: "/echarts"
          //   });
          // });
        } else {
          return false;
        }
      });
    }
  }
};

</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 150px auto;
  width: 230px;
  padding: 35px 35px 15px 35px;
  background: #E6E6FA;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  filter:alpha(Opacity=50);-moz-opacity:0.9;opacity: 0.9;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
.midRow{
  background:url('../../static/img/timg4.jpg');
  background-size:100% 100%
}
</style>
