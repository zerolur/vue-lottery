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
                    <el-button type="primary" v-on:click="">新增用户</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <!-- 订单信息列表 -->
        <el-table :data="dealData" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
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
            <el-table-column prop="userDealTime" label="最近交易日期" sortable>
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

        <el-dialog :title="title" v-model="dialogVisable" :close-on-click-modal="false" style="width:50%;margin-left:25%">
            <el-form :model="dealInfo" ref="dealInfoForm" label-width="100px" label-position="left">
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
import {} from "../../api/api";
export default {
  data() {
    return {
      isInsert: false,
      true: true,
      loading: false, //遮幕默认关闭
      page: 1, // 当前页默认为1
      queryData: {
        term: "" // 姓名/手机号/公司名称
      },
      title: "",
      dialogVisable: false,
      dealData: [],
      dealInfo : {

      }
    };
  },
  methods: {
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
  mounted() {}
};
</script>
<style>
.pageTool {
  float: right;
}
</style>