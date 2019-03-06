<template>
    <section>
        <!-- 头部搜索框 -->
        <el-form :inline="true" :model="queryData" @submit.native.prevent>
            <el-col :span="24" class="toolbar">
                <el-form-item>
                    <el-input v-model="queryData.term" @keydown.enter.native="" placeholder="请输入查询条件"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="">查询</el-button>
                    <el-button type="primary" v-on:click="">重置</el-button>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" v-on:click="toInsert">新增产品</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <!-- 产品列表 -->
        <el-table :data="productData" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column v-if="false" prop="productId" label="主键" sortable>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" sortable>
            </el-table-column>
            <el-table-column prop="companyId" label="公司ID" v-if="false" sortable>
            </el-table-column>
            <el-table-column prop="ts" label="录入时间" :formatter="formatTs" sortable>
            </el-table-column>
            <el-table-column prop="companyName" label="归属公司名称" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="公司人员姓名" sortable>
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
        <!-- 新增/修改弹框 -->
        <el-dialog :title="title" v-model="dialogVisable" :close-on-click-modal="false" style="width:50%;margin-left:25%">
            <el-form :model="productInfo" ref="productInfoForm" label-width="100px" label-position="left">
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="productInfo.productName" auto-complete="off" class="dialogInput" style="width:70%"></el-input>
                </el-form-item>
                <el-form-item label="归属公司" prop="productCompanyId">
                    <el-select v-model="productInfo.productCompanyId" filterable remote reserve-keyword placeholder="公司名称" style="width:70%" :remote-method="remoteMethod">
                        <el-option v-for="item in companyList" :key="item.userId" :label="item.userCompany" :value="item.userId">
                            <span style="float: left;display:inline-block;width:20px;">{{ item.userName }}</span>
                            <span style="float: right; font-size: 13px">{{ item.userCompany }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="impDialogVisable = false">取消</el-button>
                    <el-button type="primary" @click="insertProduct">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import util from "../../common/js/util";
import { userPageList, productPageList, saveProduct } from "../../api/api";
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
      dialogVisable: false,
      productData: [],
      productInfo: {
        productId: "",
        productName: "",
        productCompanyId: "",
        updater: JSON.parse(sessionStorage.getItem("accessUser")).userId
      },
      companyList: [] // 公司下拉列表
    };
  },
  methods: {
    // 列表信息初始化
    initProductData() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        term: this.queryData.term
      };
      productPageList(params).then(data => {
        this.productData = data.data[0].list;
        this.total = data.data[0].total;
      });
    },
    // 入库保存
    insertProduct() {
      saveProduct(this.productInfo).then(data => {
        this.$message("保存成功");
        this.initProductData;
        this.initProductData();
      });
      this.dialogVisable = false;
    },
    // 日期格式化
    formatTs(row, column) {
      if ("" == row.ts || undefined == row.ts) {
        return "";
      } else {
        let initDate = new Date(row.ts.time);
        return util.formatDate.format(initDate, "yyyy-MM-dd hh:mm:ss");
      }
    },
    // 新增入库按钮操作
    toInsert() {
      this.dialogVisable = true;
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          userPageList({ term: query }).then(data => {
            this.companyList = data.data[0].list;
          });
        }, 200);
      } else {
        this.userList = [];
      }
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
    }
  },
  mounted() {
    // 初始化产品列表
    this.initProductData();
  }
};
</script>
<style>
.pageTool {
  float: right;
}
</style>