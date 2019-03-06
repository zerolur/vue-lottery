<template>
    <section>

        <!-- 头部搜索框 -->
        <el-row>
            <el-col :span="24" class="toolbar">
                <!-- <el-form-item>
                    <el-input v-model="queryUser" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="filterUser">查询</el-button>
                </el-form-item> -->
                <el-button type="primary" :disabled="flag" v-on:click="toInsert">新增</el-button>
            </el-col>
        </el-row>
        <!-- 菜单信息列表 -->
        <el-row>
            <!-- <el-col v-if="levelOne"> -->
            <el-col :span="24" v-for="(levelOne,index) in levelOneList" :key="index">
                <p style="width:100%;height:2px;border-bottom: 2px solid #409EFF"></p>
                <el-form :model="levelOne" :inline="true" ref="userForm">
                    <el-form-item label="菜单ID" v-if="false">
                        <el-input v-model="levelOne.menuId"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单名称">
                        <el-input v-model="levelOne.menuName"></el-input>
                    </el-form-item>
                    <el-form-item label="导航路径">
                        <el-input v-model="levelOne.menuPath"></el-input>
                    </el-form-item>
                    <el-form-item label="vue文件">
                        <el-input v-model="levelOne.menuComponent"></el-input>
                    </el-form-item>
                    <el-form-item label="单节点">
                        <el-input v-model="levelOne.menuLeaf"></el-input>
                    </el-form-item>
                    <el-form-item label="是否隐藏">
                        <el-input v-model="levelOne.menuHidden"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateMenuInfo(levelOne)">保存</el-button>
                        <el-button type="danger" @click="deleteAccessMenu(levelOne)">删除</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="levelOne.children" highlight-current-row v-loading="false" @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" width="50">
                    </el-table-column>
                    <el-table-column v-if="false" prop="menuId" label="主键">
                    </el-table-column>
                    <el-table-column prop="menuName" label="菜单名称">
                    </el-table-column>
                    <el-table-column prop="menuPath" label="导航路径">
                    </el-table-column>
                    <el-table-column prop="menuComponent" label="vue文件">
                    </el-table-column>
                    <el-table-column prop="menuLeaf" label="单节点">
                    </el-table-column>
                    <el-table-column prop="menuMeta" label="参数">
                    </el-table-column>
                    <el-table-column prop="menuHidden" label="是否隐藏">
                    </el-table-column>
                    <el-table-column prop="menuBan" label="菜单状态">
                        <template slot-scope="scope">
                            <el-tag type="success" v-show="scope.row.menuBan == 0" close-transition>正常</el-tag>
                            <el-tag type="danger" v-show="scope.row.menuBan == 1" close-transition>禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="menuRemark" label="备注">
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" v-if="scope.row.menuBan == 0" @click="banMenu(scope.row)">禁用</el-button>
                            <el-button type="success" size="small" v-if="scope.row.menuBan == 1" @click="openMenu(scope.row)">启用</el-button>
                            <el-button type="warning" size="small" @click="deleteAccessMenu(scope.row)">删除</el-button>
                            <el-button type="primary" size="small" @click="toUpdateMenu(scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>

        <!-- <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col> -->
        <el-dialog title="新增导航菜单" :visible.sync="insertMenuVisible" :close-on-click-modal="false">
            <el-form :model="menuInfo" label-width="80px">
                <el-form-item label="菜单等级" prop="menuLevel">
                    <el-select v-model="menuInfo.menuLevel" placeholder="请选择菜单等级">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父菜单ID" prop="menuPid" v-if="menuInfo.menuLevel == 2">
                    <el-select v-model="menuInfo.menuPid" placeholder="请选择上级菜单">
                        <el-option v-for="item in levelOneList" :key="item.menuId" :label="item.menuName" :value="item.menuId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="menuInfo.menuName" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="导航路径" prop="menuPath">
                    <el-input v-model="menuInfo.menuPath" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <el-form-item label="引入vue全路径" prop="menuComponent">
                    <el-input v-model="menuInfo.menuComponent" auto-complete="off" class="dialogInput"></el-input>
                </el-form-item>
                <!-- <el-form-item label="单节点" prop="menuLeaf">
                    <el-switch v-model="menuInfo.menuLeaf"></el-switch>
                </el-form-item> -->
                <el-form-item label="是否隐藏" prop="menuHidden">
                    <el-switch v-model="menuInfo.menuHidden"></el-switch>
                </el-form-item>
                <el-form-item label="携带参数" prop="menuMeta">
                    <el-input v-model="menuInfo.menuMeta" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="menuRemark">
                    <el-input v-model="menuInfo.menuRemark" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click.native="insertMenuVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveOrUpdateMenuInfo">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
import {
  getAccessMenuList,
  insertAccessMenu,
  updateAccessMenu,
  deleteAccessMenu
} from "../../api/system";
export default {
  data() {
    return {
      flag : false,
      levelOneList: [],
      pageSize: 20,
      total: 0,
      sels: [],
      options: [
        {
          value: "1",
          label: "一级菜单"
        },
        {
          value: "2",
          label: "二级菜单"
        }
      ],
      menuSelect: [],
      menuInfo: {
        menuName: "",
        menuPath: "",
        menuComponent: "",
        menuLeaf: false,
        menuMeta: "",
        menuHidden: false,
        menuPid: "",
        menuRemark: "",
        menuLevel: "",
        menuBan: 0
      },
      insertMenuVisible: false // 新增弹框显示属性
    };
  },
  methods: {
    //修改菜单方法
    updateMenuInfo(form) {
      let menuInfo = {
        menuId: form.menuId,
        menuName: form.menuName,
        menuPath: form.menuPath,
        menuComponent: form.menuComponent,
        menuLeaf: form.menuLevel == 2,
        menuMeta: form.menuMeta,
        menuHidden: form.menuHidden,
        menuPid: form.menuPid,
        menuRemark: form.menuRemark,
        menuLevel: form.menuLevel,
        menuBan: form.menuBan
      };
      updateAccessMenu(menuInfo).then(data => {
        if (data.data === 1) {
          this.$message("修改菜单成功");
        } else {
          this.$message("修改菜单失败");
        }
        this.insertMenuVisible = false;
        this.initMenuList();
      });
      this.clear();
    },
    //菜单列表初始化
    initMenuList() {
      getAccessMenuList().then(data => {
        this.levelOneList = data.data;
      });
    },
    //批量删除
    batchDelete() {},
    //翻页
    handleCurrentChange() {},
    //新增菜单的保存方法
    saveOrUpdateMenuInfo() {
      this.menuInfo.menuLeaf = this.menuInfo.menuLevel == 2;
      this.menuInfo.menuHidden = this.menuInfo.menuHidden ? true : false;
      let menuId = this.menuInfo.menuId;
      if (menuId > 0) {
        //调用修改方法
        this.updateMenuInfo(this.menuInfo);
      } else {
        // 新增方法
        this.insertMenuInfo();
      }
    },
    //新增菜单按钮
    toInsert() {
      this.insertMenuVisible = true;
    },
    insertMenuInfo() {
      insertAccessMenu(this.menuInfo).then(data => {
        if (data.data === 1) {
          this.$message("已成功保存");
        } else {
          this.$message("保存失败");
        }
        this.clear();
        this.initMenuList();
        this.insertMenuVisible = false;
      });
    },
    toUpdateMenu(row) {
      //   this.menuInfo = row;
      this.menuInfo.menuId = row.menuId;
      this.menuInfo.menuName = row.menuName;
      this.menuInfo.menuPath = row.menuPath;
      this.menuInfo.menuComponent = row.menuComponent;
      this.menuInfo.menuLeaf = row.menuLevel == 2;
      this.menuInfo.menuMeta = row.menuMeta;
      this.menuInfo.menuHidden = row.menuHidden == "true" ? true : false;
      this.menuInfo.menuPid = row.menuPid;
      this.menuInfo.menuRemark = row.menuRemark;
      this.menuInfo.menuLevel = row.menuLevel;
      this.menuInfo.menuBan = row.menuBan;
      this.insertMenuVisible = true;
    },
    banMenu(row) {
      let param = {
        menuId: row.menuId,
        menuBan: 1
      };
      this.updateMenuInfo(param);
    },
    deleteAccessMenu(params) {
      deleteAccessMenu({ menuId: params.menuId }).then(data => {
        if ("error" != data.data) {
          this.$message("删除成功");
        } else {
          this.$message({
            type: "error",
            message: "删除失败"
          });
        }
        this.initMenuList();
      });
    },

    selsChange(sels) {
      this.sels = sels;
    },
    openMenu(row) {
      let param = {
        menuId: row.menuId,
        menuBan: 0
      };
      this.updateMenuInfo(param);
    },
    clear() {
      this.menuInfo.menuId = "";
      this.menuInfo.menuName = "";
      this.menuInfo.menuPath = "";
      this.menuInfo.menuComponent = "";
      this.menuInfo.menuLeaf = false;
      this.menuInfo.menuMeta = "";
      this.menuInfo.menuHidden = false;
      this.menuInfo.menuPid = "";
      this.menuInfo.menuRemark = "";
      this.menuInfo.menuLevel = "";
      this.menuInfo.menuBan = 0;
    }   
  },
  mounted() {
    this.initMenuList();
  }
};
</script>
<style>
.dialogInput {
  width: 200px;
}
</style>


