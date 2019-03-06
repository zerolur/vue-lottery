<template>
  <section>
    <el-form :inline="true" :model="queryModel" label-width="60px" label-position="left" @submit.native.prevent>
      <el-row class="toolbar">
        <el-col :span="20">
          <el-form-item label="年份:" style="font-weight: bold">
            <el-select v-model="queryModel.year" placeholder="请选择年份">
              <el-option v-for="item in yearList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月份:" style="font-weight: bold">
            <el-select v-model="queryModel.month" multiple @change="initReportData" placeholder="请选择月份" style="width:280px">
              <el-option v-for="item in monthList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :loading="logsBtnLoading" @click="showLogs" style="float: right">查看日志</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div id="chartLine" style="width:100%; height:700px;"></div>
      </el-col>
    </el-row>
    <el-dialog title="风控模型日志" :visible.sync="dialogVisable" :close-on-click-modal="false">
      <el-table :data="riskLogsList" highlight-current-row style="width: 100%;">
        <!-- <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
      </el-table-column> -->
        <el-table-column prop="ts" label="更新时间" :formatter="formatSuccessRate">
        </el-table-column>
        <el-table-column prop="modelName" label="风控模型">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.modelName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hisVal" label="历史值">
        </el-table-column>
        <el-table-column prop="newVal" label="最新值">
        </el-table-column>
        <el-table-column prop="hisSuccessRate" label="历史成功率">
          <template slot-scope="scope">
            <el-tag :type="scope.row.hisTagType">{{scope.row.hisSuccessRate}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="新成功率">
          <template slot-scope="scope">
            <el-tag :type="scope.row.newTagType">{{scope.row.newSuccessRate}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
import echarts from "echarts";

import { riskAnalysisReport, getRiskLogsList } from "../../api/risk-model";
import { ifError } from "assert";
export default {
  data() {
    return {
      logsBtnLoading: false,
      queryModel: {
        year: 2019,
        month: [1]
      },
      riskLogsList: [],
      dialogVisable: false,
      yearList: [2018, 2019, 2020],
      monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      x: [],
      yDataList: []
    };
  },

  methods: {
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.setOption({
        title: {
          text: "风控模型数据监控",
          subtext: "每次风控模型取值范围改变将同步更新"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["成功率"],
          textStyle: { fontSize: 20 },
          itemGap: 50
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: this.x
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "成功率",
            type: "line",
            data: this.yDataList,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      });
    },
    drawCharts() {
      this.drawLineChart();
    },
    initReportData() {
      let params = new URLSearchParams();
      params.append("year", this.queryModel.year);
      params.append("month", this.queryModel.month);
      riskAnalysisReport(params).then(data => {
        this.x = data.data.xDataList;
        this.yDataList = data.data.yDataList;
        this.drawCharts();
      });
    },
    // 获取日志列表
    getRiskLogsList() {
      let params = new URLSearchParams();
      params.append("year", this.queryModel.year);
      params.append("month", this.queryModel.month);
      getRiskLogsList(params).then(data => {
        if (data.data.status === 1) {
          this.riskLogsList = data.data.riskLogsList;
          this.showLogsDialog();
        } else {
          this.$notify.error({
            title: "错误",
            message: "查询错误"
          });
        }
      });
    },

    // 查看日志按钮操作
    showLogs() {
      this.logsBtnLoading = true;
      this.getRiskLogsList();
    },
    showLogsDialog() {
      this.logsBtnLoading = false;
      // 弹框
      this.dialogVisable = true;
    },
    formatSuccessRate(row, column, cellValue, index) {
      row.hisTagType =
        row.hisSuccessRate <= 50
          ? "danger"
          : row.hisSuccessRate <= 80
            ? "-"
            : row.hisSuccessRate > 80 ? "success" : "info";
      row.newTagType =
        row.newSuccessRate <= 50
          ? "danger"
          : row.newSuccessRate <= 80
            ? "-"
            : row.newSuccessRate > 80 ? "success" : "info";
      return row.ts;
    }
  },

  mounted: function() {
    this.initReportData();
  },
  updated: function() {
    this.drawCharts();
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  float: left;
}
.chart div {
  height: 400px;
  float: left;
}
</style>
