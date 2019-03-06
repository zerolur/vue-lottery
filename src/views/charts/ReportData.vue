<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="24">
        <div id="chartLine" style="width:100%; height:700px;"></div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import echarts from "echarts";

import { selectReportData } from "../../api/api";
export default {
  data() {
    return {
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      x: [],
      countUser: [],
      countBill: []
    };
  },

  methods: {
    drawLineChart() {
      this.chartLine = echarts.init(document.getElementById("chartLine"));
      this.chartLine.setOption({
        title: {
          text: "带鱼凭证数据统计",
          subtext: "仅统计近一月的数据信息"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订阅用户", "成交单量"],
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
            name: "订阅用户",
            type: "bar",
            data: this.countUser,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "成交单量",
            type: "bar",
            data: this.countBill,
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
        // title: {
        //   text: "带鱼凭证数据统计",
        //   subtext: "仅统计近一月的数据信息"
        // },
        // tooltip: {
        //   trigger: "axis"
        // },
        // legend: {
        //   data: ["订阅用户", "成交单量"],
        //   textStyle: {fontSize : 20},
        //   itemGap : 50
        // },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true
        // },
        // xAxis: {
        //   type: "bar",
        //   boundaryGap: false,
        //   // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        //   data: this.x
        // },
        // yAxis: {
        //   type: "value"
        // },
        // series: [
        //   {
        //     name: "订阅用户",
        //     type: "line",
        //     data: this.countUser
        //     // data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: "成交单量",
        //     type: "line",
        //     data: this.countBill
        //   }
        //   // {
        //   //     name: '搜索引擎',
        //   //     type: 'line',
        //   //     stack: '总量',
        //   //     data: [820, 932, 901, 934, 1290, 1330, 1320]
        //   // }
        // ]
      });
    },
    drawCharts() {
      this.drawLineChart();
    },
    initReportData() {
      selectReportData().then(data => {
        this.x = data.data[0].x;
        this.countUser = data.data[0].countUser;
        this.countBill = data.data[0].countBill;
        this.drawCharts();
      });
    }
  },

  mounted: function() {
    this.initReportData();
    // this.drawCharts();
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
/*.chart div {
        height: 400px;
        float: left;
    }*/

.el-col {
  padding: 30px 20px;
}
</style>
