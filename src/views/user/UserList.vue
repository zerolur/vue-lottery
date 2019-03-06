<template>
  <section>
    <!-- 头部搜索框 -->
    <el-form :inline="true" :model="queryData" @submit.native.prevent>
      <el-col :span="24" class="toolbar">
        <el-form-item>
          <el-input v-model="queryData.term" @keydown.enter.native="getUserList" placeholder="姓名/手机号/公司名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUserList">查询</el-button>
          <el-button type="primary" v-on:click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="toInsertUser">新增用户</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <!-- 用户信息列表 -->
    <el-table :data="userData" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column v-if="false" prop="userId" label="主键" sortable>
      </el-table-column>
      <el-table-column prop="userName" label="姓名" sortable>
      </el-table-column>
      <el-table-column prop="userPhone" label="手机号" sortable>
      </el-table-column>
      <el-table-column prop="userCompany" label="归属公司" show-overflow-tooltip sortable>
      </el-table-column>
      <el-table-column prop="userSum" label="交易总金额" sortable>
      </el-table-column>
      <el-table-column prop="userDealTime" label="最近交易日期" :formatter="formatNearTime" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" @click="showDetail(scope.$index, scope.row)">详情</el-button> -->
          <el-button type="primary" size="small" @click="toUpdate(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteUserById(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination class="pageTool" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-col>

    <el-dialog :title="title" v-model="dialogVisable" :close-on-click-modal="false" style="width:50%;margin-left:25%">
      <el-form :model="userInfo" ref="userInfoForm" label-width="100px" label-position="left">
        <el-form-item label="主键" prop="userId" v-if="false">
          <el-input v-model="userInfo.userId" auto-complete="off" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="userInfo.userName" :readonly="updateFlag" auto-complete="off" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="userInfo.userPhone" :readonly="updateFlag" auto-complete="off" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="userCompany">
          <el-input v-model="userInfo.userCompany" :readonly="updateFlag" auto-complete="off" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item v-if="isInsert" label="交易金额" prop="userSum">
          <el-input v-model="userInfo.userSum" auto-complete="off" :readonly="true" class="dialogInput" v-if="isInsert"></el-input>
        </el-form-item>
        <el-form-item v-if="isInsert" label="最近交易日期" prop="userDealTime">
          <el-date-picker v-model="userInfo.userDealTime" format="yyyy-MM-dd HH:mm:ss" :readonly="true" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="dialogVisable = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdate">保存</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="6">
      </el-col>
    </el-dialog>
  </section>
</template>
<script>
import util from "../../common/js/util";
import {
  updateUserInfo,
  userPageList,
  selectUserById,
  insertUser,
  deleteUser,
  batchDeleteUser
} from "../../api/api";
export default {
  data() {
    return {
      isInsert: false,
      true: true,
      loading: false, //遮幕默认关闭
      userData: [], //用户列表
      page: 1, // 当前页默认为1
      queryData: {
        term: "" // 姓名/手机号/公司名称
      },
      sels: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      currentPage: 0,
      userInfo: {
        userId: "",
        userName: "",
        userPhone: "",
        userCompany: "",
        userSum: "",
        updater: "",
        userDealTime: ""
      },
      title: "", // 弹框标题
      dialogVisable: false, // 弹窗显示/隐藏
      updateFlag: false // 是否可修改
    };
  },
  methods: {
    evaUserInfo(data) {
      this.userInfo.userId = data.userId;
      this.userInfo.userName = data.userName;
      this.userInfo.userPhone = data.userPhone;
      this.userInfo.userCompany = data.userCompany;
      this.userInfo.userSum = data.userSum;
      this.userInfo.updater = data.updater;
      this.userInfo.userDealTime =
        data.userDealTime === null ? "" : data.userDealTime.time;
    },
    // 新增弹框
    toInsertUser() {
      this.isInsert = false;
      this.dialogVisable = true;
      this.clear();
    },

    // 修改弹框
    toUpdate(index, row) {
      this.isInsert = true;
      let userId = row.userId;
      selectUserById({
        userId: userId
      }).then(data => {
        this.evaUserInfo(data.data[0]);
        this.title = "修改用户";
        this.dialogVisable = true;
      });
    },
    // 新增/修改保存方法
    saveOrUpdate() {
      let user = JSON.parse(sessionStorage.getItem("accessUser"));
      this.userInfo.updater = user.userId;
      if (this.userInfo.userId == "") {
        // 新增
        insertUser(this.userInfo).then(data => {
          this.$message(data.data === 1 ? "保存成功" : "保存失败");
          this.dialogVisable = false;
          this.getUserList();
        });
      } else {
        // 修改
        updateUserInfo(this.userInfo).then(data => {
          this.$message(data.data === 1 ? "保存成功" : "保存失败");
          this.dialogVisable = false;
          this.getUserList();
        });
      }
    },
    // 删除用户信息
    deleteUserById(index, row) {
      this.$confirm("确认删除该条记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteUser({
            userId: row.userId,
            updater : JSON.parse(sessionStorage.getItem("accessUser")).userId
          }).then(data => {
            this.$message(data.data === 1 ? "删除成功" : "删除失败");
            this.getUserList();
          });
        })
        .catch(() => {});
    },
    // 批量删除用户信息
    batchDelete() {
      var ids = this.sels.map(item => item.userId).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            ids: ids,
            updater: JSON.parse(sessionStorage.getItem("accessUser")).userId
          };
          batchDeleteUser(para).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserList();
          });
        })
        .catch(() => {});
    },
    // 重置查询
    resetQuery() {
      this.queryData.term = "";
      this.getUserList();
    },

    // 用户列表查询
    getUserList() {
      debugger;
      this.loading = true;
      let params = {
        term: this.queryData.term, // 姓名/手机号/公司名称
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      userPageList(params).then(data => {
        this.userData = data.data[0].list;
        this.total = data.data[0].total;
        this.loading = false;
      });
      // axios
      //   .post(this.$path + "userPageList", qs.stringify(params))
      //   .then(data => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    formatNearTime(row, column) {
      if ("" == row.userDealTime || undefined == row.userDealTime) {
        return "暂无交易信息";
      } else {
        let initDate = new Date(row.userDealTime.time);
        return util.formatDate.format(initDate, "yyyy-MM-dd hh:mm:ss");
      }
    },
    clear() {
      (this.userInfo.userId = ""),
        (this.userInfo.userName = ""),
        (this.userInfo.userPhone = ""),
        (this.userInfo.userCompany = ""),
        (this.userInfo.userSum = ""),
        (this.userInfo.updater = ""),
        (this.userInfo.userDealTime = "");
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>
<style>
.pageTool {
  float: right;
}
</style>