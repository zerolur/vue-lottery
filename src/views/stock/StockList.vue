<template>
    <section>
        <!-- 头部搜索框 -->
        <el-form :inline="true" :model="queryData" @submit.native.prevent>
            <el-col :span="24" class="toolbar">
                <el-form-item>
                    <el-input v-model="queryData.term" @keydown.enter.native="" placeholder="姓名/手机号/公司名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="">查询</el-button>
                    <el-button type="primary" v-on:click="">重置</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" v-on:click="toImpStock">新增入库</el-button>
                    <el-button type="primary" :disabled="this.sels.length===1" v-on:click="">新增出库</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <!-- 库存列表 -->
        <el-table :data="stockData" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column v-if="false" prop="stockId" label="主键" sortable>
            </el-table-column>
            <el-table-column prop="stockName" label="产品名称" sortable>
            </el-table-column>
            <el-table-column prop="stockSum" label="入库总量" sortable>
            </el-table-column>
            <el-table-column prop="stockNum" label="当前剩余库存" sortable>
            </el-table-column>
            <el-table-column prop="stockPrice" label="单价" sortable>
            </el-table-column>
            <el-table-column prop="userDealTime" label="入库时间" :formatter="formatImpTime" sortable>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <!-- <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button> -->
            <el-pagination class="pageTool" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-col>
        <!-- 入库弹框 -->
        <el-dialog :title="title" v-model="impDialogVisable" :close-on-click-modal="false" style="width:50%;margin-left:25%">
            <el-form :model="stockInfo" ref="stockInfoForm" label-width="100px" label-position="left">
                <el-form-item label="产品名称" prop="stockName">
                    <el-input v-model="stockInfo.stockName" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="stockSum">
                    <el-input type="number" v-model="stockInfo.stockSum" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="stockPrice">
                    <el-input type="number" v-model="stockInfo.stockPrice" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="检测员" prop="stockImper">
                    <el-input v-model="stockInfo.stockImper" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="impDialogVisable = false">取消</el-button>
                    <el-button type="primary" @click="impStockSave">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 出库弹框 -->
        <el-dialog :title="title" v-model="dialogVisable" :close-on-click-modal="false" style="width:60%;margin-left:20%">
            <el-form :model="dealInfo" ref="dealInfoForm" label-width="100px" label-position="left">
                <el-form-item label="产品名称" prop="dealGoodsId" v-if="false">
                    <el-input v-model="dealInfo.dealGoodsId" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="dealGoodsName">
                    <el-input v-model="dealInfo.dealGoodsName" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="dealGoodsNum">
                    <el-input type="number" v-model="dealInfo.dealGoodsNum" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="单价" prop="dealGoodsPrice">
                    <el-input v-model="dealInfo.dealGoodsPrice" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="dealGoodsSum">
                    <el-input v-model="dealInfo.dealGoodsNum*dealInfo.dealGoodsPrice" :readonly="true" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="订单编号" prop="dealOrderNum">
                    <el-input v-model="dealInfo.dealOrderNum" auto-complete="off" :readonly="true" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="检测员" prop="inspector">
                    <el-input v-model="dealInfo.inspector" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="购买公司" prop="dealBuyer">
                    <el-input v-model="dealInfo.dealBuyer" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="dialogVisable = false">取消</el-button>
                    <el-button type="primary" @click="">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import util from "../../common/js/util";
import { stockPageList } from "../../api/api";
export default {
  data() {
    return {
      isInsert: false,
      true: true,
      loading: false, //遮幕默认关闭
      pageNum: 1, // 当前页默认为1
      pageSize: 20, // 每页条数
      total: 0,
      sels: [],
      queryData: {
        term: "" // 姓名/手机号/公司名称
      },
      title: "",
      impDialogVisable: false,
      dialogVisable: false,
      stockData: [],
      stockInfo: {
        stockId: "",
        stockName: "",
        stockSum: "",
        stockNum: "",
        stockPrice: "",
        stockImper: "",
        stockExper: "",
        updater: JSON.parse(sessionStorage.getItem("accessUser")).userId
      },
      dealInfo: {
        dealId: "",
        dealGoodsId: "",
        dealGoodsName: "",
        dealGoodsNum: 0,
        dealGoodsPrice: 0.0,
        dealGoodsSum: 0,
        dealType: "",
        dealOrderNum: "",
        inspector: "",
        dealBuyer: "",
        updater: JSON.parse(sessionStorage.getItem("accessUser")).userId
      }
    };
  },
  methods: {
    // 列表信息初始化
    initStockData() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        term: this.queryData.term
      };
      stockPageList(params).then(data => {
        this.stockData = data.data[0].list;
        this.total = data.data[0].total;
      });
    },
    // 入库保存
    impStockSave() {},
    // 日期格式化
    formatImpTime(row, column) {
      if ("" == row.stockImpTime || undefined == row.stockImpTime) {
        return "";
      } else {
        let initDate = new Date(row.stockImpTime.time);
        return util.formatDate.format(initDate, "yyyy-MM-dd hh:mm:ss");
      }
    },
    // 新增入库按钮操作
    toImpStock() {
      this.dealInfo.dealOrderNum = util.orderNumMaker();
      this.impDialogVisable = true;
    },
    // 新增出库操作
    toExpStock() {},

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
    }
  },
  mounted() {
    this.initStockData();
  },
  computed: {
    dealGoodsSum: function() {
      return this.dealInfo.dealGoodsNum * this.dealInfo.dealGoodsPrice;
    }
  }
};
</script>
<style>
.pageTool {
  float: right;
}
</style>