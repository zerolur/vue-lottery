<template>
  <section>
    <!-- 头部工具条 -->
    <el-form :inline="true">
      <el-col :span="24" class="toolbar">
        <!-- <el-form-item>
                    <el-input v-model="queryUser" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="filterUser">查询</el-button>
                </el-form-item> -->
        <el-form-item style="float:right">
          <el-button type="primary" v-on:click="toInsert">新增</el-button>
          <!-- <el-button type="primary" v-on:click="initpsw">初始化密码</el-button> -->
        </el-form-item>
      </el-col>
    </el-form>
    <!-- 角色信息列表 -->
    <el-table :data="roleList" highlight-current-row v-loading="loading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column v-if="false" prop="roleId" label="主键" sortable>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" sortable>
      </el-table-column>
      <el-table-column prop="roleName" label="角色描述" sortable>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.roleLocked == 0" close-transition>启用</el-tag>
          <el-tag type="danger" v-show="scope.row.roleLocked == 1" close-transition>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="roleCreatetime" label="创建时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column prop="roleUpdatetime" label="修改时间" :formatter="formatDate" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="toUpdateRole(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="banRole(scope.row)">禁用</el-button>
          <el-button type="success" size="small" @click="openRole(scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 新增/修改弹框 -->
    <el-dialog :title="title" :visible.sync="insertRoleVisible" :close-on-click-modal="false">
      <el-row>
        <el-col :span="12">
          <el-form :model="roleInfo" label-width="80px" ref="accessRoleForm" :rules="rules">
            <el-form-item label="角色ID" prop="roleId" v-if="false">
              <el-input v-model="roleInfo.roleId" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model.trim="roleInfo.roleName" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDes">
              <el-input v-model="roleInfo.roleDes" auto-complete="off" class="dialogInput"></el-input>
            </el-form-item>
            <el-form-item label="角色状态" prop="roleLocked">
              <el-switch v-model="roleInfo.roleLocked"></el-switch>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="margin-bottom:15">
          <el-tree :data="menuNodes" show-checkbox default-expand-all node-key="id" ref="tree" :default-checked-keys="checkdNodes" highlight-current :props="defaultProps">
          </el-tree>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="20" :span="4" style="margin-top:15px">
          <el-button @click.native="insertRoleVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdateRoleInfo">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </section>
</template>
<script>
import util from "../../common/js/util";
import {
  getAccessRoleList,
  insertAccessRole,
  updateAccessRole,
  deleteAccessRole,
  getAllNodes,
  batchRemoveRole,
  getCheckedNodes,
  chkRoleOnly
} from "../../api/system";
export default {
  data() {
    var validateRoleOnly = (rule, value, callback) => {
      // 新增/修改角色名称不为旧名称 启用唯一性校验
      if (this.roleInfo.roleId === "" || value != this.roleNameFlag) {
        chkRoleOnly({ roleName: value }).then(data => {
          if (data.data) {
            // 校验唯一
            callback();
          } else {
            callback(new Error("角色名称被占用,请重新输入!"));
          }
        });
      } else {
        callback();
      }
    };
    return {
      title: "创建角色",
      roleList: [],
      loading: false,
      page: 1,
      total: 0,
      sels: [],
      menuNodes: [],
      checkdNodes: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      total: 0, // 总条数
      page: 1,
      pageSize: 20,
      insertRoleVisible: false,
      roleInfo: {
        roleId: "",
        roleName: "",
        roleLocked: true,
        roleDes: ""
      },
      roleNameFlag: "",
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          },
          { validator: validateRoleOnly, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    initRoleList() {
      let param = {
        // queryUser: this.queryUser,
        page: this.page,
        pageSize: this.pageSize
      };
      getAccessRoleList(param).then(data => {
        this.roleList = data.data[0].list;
        this.total = data.data[0].total;
      });
    },
    initMenuNodes() {
      getAllNodes().then(data => {
        this.menuNodes = data.data;
      });
    },
    // 弹框新增角色
    toInsert() {
      this.clear();
      this.title = "创建角色";
      if (this.$refs.tree != undefined) {
        this.$refs.tree.setCheckedKeys([]);
      }
      this.insertRoleVisible = true;
    },
    // 弹框修改角色
    toUpdateRole(row) {
      this.title = "修改角色";
      this.insertRoleVisible = true;

      this.checkdNodes = [];
      // this.$refs.tree.setCheckedKeys([]);
      this.roleInfo.roleId = row.roleId;
      this.roleInfo.roleName = row.roleName;
      this.roleNameFlag = row.roleName;
      this.roleInfo.roleLocked = row.roleLocked === 0;
      this.roleInfo.roleDes = row.roleDes;
      getCheckedNodes({ roleId: row.roleId }).then(data => {
        this.checkdNodes = data.data;
        this.$refs.tree.setCheckedKeys(this.checkdNodes);
      });
    },
    // 禁用角色
    banRole(row) {
      this.clear2();
      this.roleInfo.roleId = row.roleId;
      this.roleInfo.roleLocked = false;
      this.updateRoleInfo();
    },
    // 启用角色
    openRole(row) {
      this.clear2();
      this.roleInfo.roleId = row.roleId;
      this.roleInfo.roleLocked = true;
      this.updateRoleInfo();
    },
    selsChange(sels) {
      this.sels = sels;
    },
    batchDelete() {
      var ids = this.sels.map(item => item.roleId).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            ids: ids
          };
          batchRemoveRole(para).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.initRoleList();
          });
        })
        .catch(() => {});
    },
    handleCurrentChange() {},

    saveOrUpdateRoleInfo() {
      this.$refs["accessRoleForm"].validate(valid => {
        if (valid) {
          let roleId = this.roleInfo.roleId;
          if (roleId > 0) {
            // 调用修改方法
            this.updateRoleInfo();
          } else {
            // 新增方法
            this.insertRoleInfo();
          }
        } else {
          return false;
        }
      });
    },
    // 新增角色的保存方法
    insertRoleInfo() {
      this.roleInfo.roleLocked = this.roleInfo.roleLocked ? 0 : 1;
      let params = new URLSearchParams();
      params.append("menuIds", this.$refs.tree.getCheckedKeys());
      params.append("roleId", this.roleInfo.roleId);
      params.append("roleName", this.roleInfo.roleName);
      params.append("roleLocked", this.roleInfo.roleLocked);
      params.append("roleDes", this.roleInfo.roleDes);

      insertAccessRole(params).then(data => {
        if (data.data > 0) {
          this.$message("保存成功");
        } else {
          this.$message("保存失败");
        }
        this.clear();
        this.$refs.tree.setCheckedKeys([]);
        this.initRoleList();
        this.insertRoleVisible = false;
      });
    },
    // 修改角色的保存方法
    updateRoleInfo() {
      this.roleInfo.roleLocked = this.roleInfo.roleLocked ? 0 : 1;
      let params = new URLSearchParams();
      params.append(
        "menuIds",
        this.$refs.tree === undefined ? [] : this.$refs.tree.getCheckedKeys()
      );
      params.append("roleId", this.roleInfo.roleId);
      if (this.roleInfo.roleName != undefined) {
        params.append("roleName", this.roleInfo.roleName);
      }
      if (this.roleInfo.roleLocked != undefined) {
        params.append("roleLocked", this.roleInfo.roleLocked);
      }
      if (this.roleInfo.roleDes != undefined) {
        params.append("roleDes", this.roleInfo.roleDes);
      }

      updateAccessRole(params).then(data => {
        if (data.data > 0) {
          this.$message("保存成功");
        } else {
          this.$message("保存失败");
        }
        this.clear();
        this.initRoleList();
        this.insertRoleVisible = false;
      });
    },
    clear() {
      this.roleInfo.roleId = "";
      this.roleInfo.roleName = "";
      this.roleInfo.roleLocked = true;
      this.roleInfo.roleDes = "";
    },
    clear2() {
      this.roleInfo = {};
    },
    formatDate(row, column) {
      let value =
        column.property === "roleCreatetime"
          ? row.roleCreatetime
          : row.roleUpdatetime;
      if ("" === value || undefined === value) {
        return "";
      } else {
        let initDate = new Date(value.time);
        return util.formatDate.format(initDate, "yyyy-MM-dd hh:mm:ss");
      }
    }
  },
  mounted() {
    this.initRoleList();
    this.initMenuNodes();
  }
};
</script>
<style>
.dialogInput {
  width: 200px;
}
</style>