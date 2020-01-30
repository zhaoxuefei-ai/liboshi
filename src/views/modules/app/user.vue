<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('app:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-if="isAuth('app:user:delete')" type="danger" @click="deleteHandle()"
                           :disabled="dataListSelections.length <= 0">批量删除
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="40">
            </el-table-column>
            <!--            <el-table-column-->
            <!--                type="index"-->
            <!--                width="50"-->
            <!--                header-align="center"-->
            <!--                align="center"-->
            <!--                label="序号"-->
            <!--            ></el-table-column>-->
            <el-table-column
                prop="online"
                header-align="center"
                align="center"
                width="80"
                label="在线状态">
                <template slot-scope="scope">
                    <el-tag v-if="isOnline(scope.row.lastLoginTime)" type="success" effect="dark">在线</el-tag>
                    <el-tag v-else type="info" effect="plain">离线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="username"
                header-align="center"
                align="center"
                width="120"
                label="用户名">
            </el-table-column>
            <el-table-column
                prop="company"
                header-align="center"
                align="center"
                label="所属公司">
            </el-table-column>
            <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                width="100"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="expireTime"
                header-align="center"
                align="center"
                width="100"
                label="到期时间">
            </el-table-column>
            <el-table-column
                prop="calExpireTimeList"
                header-align="center"
                align="center"
                width="200"
                label="允许计算器范围">
                <template slot-scope="scope">
                    <el-tag style="margin-left: 3px" v-if="getTag(map)"
                            v-for="map in JSON.parse(scope.row.calExpireTimeList)">{{map.name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="ipRangeList"
                header-align="center"
                align="center"
                width="120"
                label="允许地址范围">
            </el-table-column>
            <el-table-column
                prop="remark"
                header-align="center"
                align="center"
                width="80"
                label="备注">
            </el-table-column>
            <el-table-column
                prop="lastLoginTime"
                header-align="center"
                align="center"
                width="100"
                label="上次登陆时间">
                <template slot-scope="scope">
                    {{$DateFormat(new Date(scope.row.lastLoginTime)) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="useTime"
                header-align="center"
                align="center"
                width="80"
                label="总计使用时间">
                <template slot-scope="scope">
                    <!--                    约定  useTime 是 使用了30秒的次数-->
                    {{((scope.row.useTime*30)/60/60).toFixed(2)}}小时
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="100"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
  import AddOrUpdate from './user-add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 100,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      isOnline (lastLoginTime) {
        let localTimestamp = Date.now()
        return parseInt(localTimestamp) - parseInt(lastLoginTime) < 60 * 1000
      },
      // 为tag计算内容 只显示可用的
      getTag (map) {
        return new Date(map.expire).getTime() > new Date().getTime()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/app/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/app/user/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style>
</style>
