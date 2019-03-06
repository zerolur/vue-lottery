<template>
    <section>
        <!-- 头部搜索框 -->
        <el-form :inline="true" :model="topAnalysis" @submit.native.prevent>
            <el-col :span="24" class="toolbar">
                <el-form-item label="综合成功率: " style="font-weight: bold">
                    <el-progress style="width: 100px;padding:10px 0;" :text-inside="true" :stroke-width="18" :percentage="topAnalysis.homeSuccessRate" :status="topAnalysis.homeProgress"></el-progress>
                </el-form-item>
                <el-form-item label="   ">
                </el-form-item>
                <el-form-item label="第三方Api参考成功率: " style="font-weight: bold">
                    <el-progress style="width: 100px;padding:10px 0;" :text-inside="true" :stroke-width="18" :percentage="topAnalysis.tpSuccessRate" :status="topAnalysis.tpProgress"></el-progress>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" @click="">查询</el-button>
                    <el-button type="primary" @click="">重置</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" @click="">新增用户</el-button>
                </el-form-item> -->
            </el-col>
        </el-form>
        <!-- 风控模型列表 -->
        <el-table :data="modelList" highlight-current-row v-loading="loading" style="width: 100%;">
            <el-table-column v-if="false" prop="id" label="主键">
            </el-table-column>
            <el-table-column prop="riskModel" label="风控模型" :formatter="formatProgressColor">
            </el-table-column>
            <el-table-column prop="riskValType" label="值域类型" :formatter="formatValType">
            </el-table-column>
            <el-table-column prop="riskVal" label="值域" :formatter="formatRiskVal">
            </el-table-column>
            <el-table-column label="当前成功率(%)">
                <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.riskSuccessRate" :status="scope.row.progressColor"></el-progress>
                </template>
            </el-table-column>
            <el-table-column prop="riskType" label="风控类型" :formatter="formatRiskType">
            </el-table-column>
            <el-table-column label="风控开关">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.riskSwitch" @change="riskSwitch(scope.row.id,scope.row.riskSwitch)" active-text="启用" inactive-text="禁用" active-color="#13ce66" inactive-color="#ff4949" :active-value="activeVal" :inactive-value="inactiveVal">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="formatUpdateTime" sortable>
            </el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" size="small" @click="showDetail(scope.$index, scope.row)">详情</el-button> -->
                    <el-button type="primary" size="mini" @click="test(scope)">修改</el-button>
                    <el-button type="danger" size="mini" @click="">删除</el-button>
                    <el-button type="success" size="mini" :disabled="scope.$index === 0" icon="el-icon-caret-top"></el-button>
                    <el-button type="warning" size="mini" :disabled="scope.$index === modelList.length-1" icon="el-icon-caret-bottom"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination class="pageTool" @size-change="" @current-change="" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
                    <el-button type="primary" @click="">保存</el-button>
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
import { riskModelList, riskModelSwitch } from "../../api/risk-model";
import { ifError } from "assert";

export default {
  data() {
    return {
      activeVal: 1,
      inactiveVal: 2,
      isInsert: false,
      true: true,
      loading: false, //遮幕默认关闭
      modelList: [], //用户列表
      page: 1, // 当前页默认为1
      topAnalysis: {
        homeSuccessRate: 50,
        tpSuccessRate: 85,
        homeProgress: "exception",
        tpProgress: "success"
      },
      progressCircleWidth: 35,
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
      test(scope){
          console.log(scope);
      },

    // 风控模型列表数据加载
    getRiskModelList() {
      riskModelList(null).then(data => {
        this.modelList = data.data;
      });
    },
    // 风控模型开关事件
    riskSwitch(id, val) {
      let params = {
        riskId: id,
        riskSwitch: val
      };
      riskModelSwitch(params).then(data => {
        if (data.data.status == 1) {
          this.$notify({
            title: "成功",
            message: "操作成功",
            type: "success",
            showClose: false,
            position: 'bottom-right'
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: data.data.msg
          });
        }
        this.getRiskModelList();
      });
    },
    formatUpdateTime(row, column) {
      if ("" == row.updateTime || undefined == row.updateTime) {
        return "未知";
      } else {
        let initDate = new Date(row.updateTime);
        return util.formatDate.format(initDate, "yyyy-MM-dd hh:mm:ss");
      }
    },
    formatValType(row, column) {
      return row.riskValType == 1
        ? "固定值"
        : row.riskValType == 2 ? "范围取值" : "未知";
    },
    formatProgressColor(row, column) {
      row.progressColor =
        row.riskSuccessRate <= 50
          ? "exception"
          : row.riskSuccessRate >= 80 ? "success" : "text";
      return row.riskModel;
    },
    formatRiskVal(row, column) {
      return row.riskValType == 1
        ? row.riskValFixed
        : row.riskValType == 2
          ? row.riskValMin + " ~ " + row.riskValMax
          : "未知";
    },
    formatRiskType(row, column) {
      //  1-确定项 2-待确定项 3-否定项 4-不确定项
      return row.riskType == 1
        ? "确定项"
        : row.riskType == 2
          ? "待确定项"
          : row.riskType == 3
            ? "否定项"
            : row.riskType == 4 ? "不确定项" : "未知";
    }
  },
  mounted() {
    this.getRiskModelList();
  }
};
</script>
<style>
.pageTool {
  float: right;
}
</style>