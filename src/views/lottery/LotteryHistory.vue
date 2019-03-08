<template>
  <section>
    <!-- 头部搜索框 -->
    <el-form :inline="true" @submit.native.prevent>
      <el-col :span="24" class="toolbar">
        <!-- <el-form-item label="综合成功率: " style="font-weight: bold">
                    <el-progress style="width: 100px;padding:10px 0;" :text-inside="true" :stroke-width="18" :percentage="topAnalysis.homeSuccessRate" :status="topAnalysis.homeProgress"></el-progress>
                </el-form-item>
                <el-form-item label="   ">
                </el-form-item>
                <el-form-item label="第三方Api参考成功率: " style="font-weight: bold">
                    <el-progress style="width: 100px;padding:10px 0;" :text-inside="true" :stroke-width="18" :percentage="topAnalysis.tpSuccessRate" :status="topAnalysis.tpProgress"></el-progress>
                </el-form-item> -->
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
    <el-table :data="historyList" highlight-current-row v-loading="loading" style="width: 100%;">
      <el-table-column v-if="false" prop="id" label="主键">
      </el-table-column>
      <el-table-column label="1">
        <template slot-scope="scope">
          <span v-if="!valInRow(1,scope.row)">1</span>
          <span class="redBall" v-if="valInRow(1,scope.row)">1</span>
        </template>
      </el-table-column>
      <el-table-column label="2">
        <template slot-scope="scope">
          <span v-if="!valInRow(1,scope.row)">1</span>
          <span class="blueBall" v-if="valInRow(1,scope.row)">1</span>
        </template>
      </el-table-column>
      <el-table-column label="3">
      </el-table-column>
      <el-table-column label="4">
      </el-table-column>
      <el-table-column label="5">
      </el-table-column>
      <el-table-column label="6">
      </el-table-column>
      <el-table-column label="7">
      </el-table-column>
    </el-table>
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
  import {
    riskModelList,
    riskModelSwitch
  } from "../../api/risk-model";
  import {
    ifError
  } from "assert";

  export default {
    data() {
      return {
        loading: false,
        ballWidth: '35px',
        historyList: [{
          one: 1,
          two: 2
        }]
      };
    },
    filters: {
      filterBall(row) {
        console.log(row);
      }
    },
    methods: {
      formatRiskType(row, column) {
        //  1-确定项 2-待确定项 3-否定项 4-不确定项
        return row.riskType == 1 ?
          "确定项" :
          row.riskType == 2 ?
          "待确定项" :
          row.riskType == 3 ?
          "否定项" :
          row.riskType == 4 ? "不确定项" : "未知";
      },
      valInRow(value, row) {
        for (var i in row) {
          if (row.hasOwnProperty(i) === true) {
            if (value === row[i]) {
              return true;
            }
          }
        }
        return false;
      },

    },
    mounted() {
      // this.getRiskModelList();
    }
  };
</script>
<style>
  .pageTool {
    float: right;
  }

  .redBall {
    border-radius: 50%;
    border: 2px solid #f54646;
    height: 15px;
    width: 15px;
    text-align: center;
    line-height: 15px;
    display: block;
    color: #f54646
  }

  .blueBall {
    border-radius: 50%;
    border: 2px solid #39f;
    height: 15px;
    width: 15px;
    text-align: center;
    line-height: 15px;
    display: block;
    color: #39f
  }
</style>