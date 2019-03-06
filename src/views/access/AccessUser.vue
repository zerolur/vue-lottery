<template>
  <section>
    <!-- 头部搜索框 -->
    <el-form :inline="true" @submit.native.prevent>
      <el-col :span="24" class="toolbar">
        <el-form-item>
          <el-input v-model="queryUser" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="filterUser">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="toInsert">新增</el-button>
          <el-button type="primary" v-on:click="initpsw">初始化密码</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- 用户信息列表 -->
    <el-table :data="userList" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column v-if="false" prop="userId" label="主键" sortable>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" sortable>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.userLocked == 0" close-transition>正常</el-tag>
          <el-tag type="danger" v-show="scope.row.userLocked == 1" close-transition>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="banUser(scope.row)" v-if="scope.row.userLocked == 0">禁用</el-button>
          <el-button type="success" size="small" @click="openUser(scope.row)" v-if="scope.row.userLocked == 1">启用</el-button>
          <el-button type="primary" size="small" @click="bindRole(scope.row)">编辑角色</el-button>
          <el-button type="warning" size="small" @click="toUpdateUser(scope.row)">修改用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="新增用户" :visible.sync="insertFormVisible" :close-on-click-modal="false">
      <el-form :model="userInfo" label-width="80px" ref="accessUserForm" :rules="rules">
        <el-form-item label="用户ID" prop="userId" v-if="false">
          <el-input v-model="userInfo.userId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="userName">
          <el-input v-model.trim="userInfo.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword" v-if="insertShow">
          <el-input type="password" v-model.trim="userInfo.userPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="userLocked">
          <el-switch v-model="userInfo.userLocked"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="insertFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdateUserInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="选择关联角色" :visible.sync="checkRoleVisible" :close-on-click-modal="false">
      <el-row>
        <el-col>
          <el-tree :data="roleNodes" show-checkbox default-expand-all node-key="id" ref="tree" :default-checked-keys="checkdNodes" highlight-current :props="defaultProps">
          </el-tree>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="20" :span="4" style="margin-top:15px">
          <el-button @click.native="checkRoleVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBindRole">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </section>

</template>
<script>
import {
  getAccessUserList,
  getAllRoleNodes,
  bindAccessRole,
  getCheckedRole,
  insertAccessUserInfo,
  updateAccessUserInfo,
  batchRemoveUser,
  initUserPsw,
  chkUserOnly
} from "../../api/system";
export default {
  data() {
    var validateUserOnly = (rule, value, callback) => {
      // 新增/修改用户名称不为旧名称 启用唯一性校验
      if (this.userInfo.userId === "" || value != this.userNameFlag) {
        chkUserOnly({ userName: value }).then(data => {
          if (data.data) {
            // 校验唯一
            callback();
          } else {
            callback(new Error("用户名被占用,请重新输入!"));
          }
        });
      } else {
        callback();
      }
    };
    return {
      userList: [],
      loading: false,
      page: 1,
      total: 0,
      queryUser: "",
      sels: [],
      total: 0, // 总条数
      page: 1,
      pageSize: 20,
      insertFormVisible: false,
      userInfo: {
        userId: "",
        userName: "",
        userPassword: "",
        userLocked: true,
        userType : 0
      },
      insertShow: true,
      checkRoleVisible: false, // 关联角色弹框显示/隐藏
      roleNodes: [{ id: -1, label: "全选", children: [] }], // 角色下拉数组
      checkdNodes: [], // 已关联的角色
      defaultProps: {
        children: "children",
        label: "label"
      },
      userId: "", //用户关联角色所选ID
      userNameFlag: "",
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          { validator: validateUserOnly, trigger: "blur" }
        ],
        userPassword: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //跳转用户详情页
    showDetail(row) {},
    //批量删除用户方法
    batchDelete() {
      var ids = this.sels.map(item => item.userId).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            ids: ids,
            updater: sessionStorage.getItem("updtaer")
          };
          batchRemoveUser(para).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.loadUserList();
          });
        })
        .catch(() => {});
    },
    loadUserList() {
      let param = {
        queryUser: this.queryUser,
        page: this.page,
        pageSize: this.pageSize
      };
      getAccessUserList(param).then(data => {
        this.userList = data.data[0].list;
        this.total = data.data[0].total;
      });
    },
    //根据过滤条件查询登录用户
    filterUser() {
      this.loadUserList();
    },
    //翻页操作
    handleCurrentChange(val) {
      this.page = val;
      this.loadUserList();
    },
    //新增用户弹框
    toInsert() {
      this.clear();
      this.insertFormVisible = true;
      this.insertShow = true;
    },
    toUpdateUser(row) {
      this.insertShow = false;
      this.userInfo.userId = row.userId;
      this.userInfo.userName = row.userName;
      this.userNameFlag = row.userName;
      this.userInfo.userPassword = row.userPassword;
      this.userInfo.userLocked = row.userLocked == 0 ? true : false;
      this.insertFormVisible = true;
    },
    // 保存用户
    saveOrUpdateUserInfo() {
      this.$refs["accessUserForm"].validate(valid => {
        if (valid) {
          this.insertFormVisible = false;
          let userId = this.userInfo.userId;
          this.userInfo.userLocked = this.userInfo.userLocked ? 0 : 1;
          if (userId > 0) {
            //修改
            this.updateUserInfo();
          } else {
            //新增
            this.insertUserInfo();
          }
        } else {
          return false;
        }
      });
    },
    insertUserInfo() {
      insertAccessUserInfo(this.userInfo).then(data => {
        if (data.data > 0) {
          this.$message("保存成功");
        } else {
          this.$message("保存失败");
        }
        this.clear();
        this.loadUserList();
      });
    },
    updateUserInfo() {
      updateAccessUserInfo(this.userInfo).then(data => {
        if (data.data > 0) {
          this.$message("保存成功");
        } else {
          this.$message("保存失败");
        }
        this.clear();
        this.loadUserList();
      });
    },
    //禁用用户
    banUser(row) {
      this.userInfo = {};
      this.userInfo.userId = row.userId;
      this.userInfo.userLocked = 1;
      this.updateUserInfo();
    },
    //启用用户
    openUser(row) {
      this.userInfo = {};
      this.userInfo.userId = row.userId;
      this.userInfo.userLocked = 0;
      this.updateUserInfo();
    },
    //初始化用户密码
    initpsw() {
      if (this.sels.length != 1) {
        this.$message("请选择一条用户数据进行初始化密码操作");
      } else {
        initUserPsw({ userId: this.sels[0].userId, psw: 123 }).then(data => {
          if (data.data != "error") {
            this.$message({
              type: "success",
              message: "已初始化密码为:" + data.data
            });
          } else {
            this.$message({
              type: "error",
              message: "操作失败"
            });
          }
        });
      }
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    getAllRoleNodes() {
      getAllRoleNodes().then(data => {
        this.roleNodes[0].children = data.data;
      });
    },
    bindRole(row) {
      this.checkdNodes = [];
      this.checkRoleVisible = true;
      if (this.$refs.tree != undefined) {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.userId = row.userId;
      getCheckedRole({ userId: this.userId }).then(data => {
        this.checkdNodes = data.data;
        this.$refs.tree.setCheckedKeys(this.checkdNodes);
      });
    },
    saveBindRole() {
      let params = new URLSearchParams();
      params.append("userId", this.userId);
      params.append("roleIds", this.$refs.tree.getCheckedKeys());
      bindAccessRole(params).then(data => {
        if (data.data != "error") {
          this.$message("保存成功");
        } else {
          this.$message({
            message: "保存失败",
            type: "error"
          });
        }
      });
      this.checkRoleVisible = false;
    },
    clear() {
      this.userInfo.userName = "";
      this.userInfo.userPassword = "";
      this.userInfo.userLocked = true;
      this.userInfo.userId = "";
    }
  },
  mounted() {
    this.loadUserList();
    this.getAllRoleNodes();
  }
};
</script>